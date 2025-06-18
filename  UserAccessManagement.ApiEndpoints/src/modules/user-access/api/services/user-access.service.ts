import { Injectable, Inject, UnauthorizedException, ForbiddenException, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../interfaces/user.interface';
import { IRole } from '../interfaces/role.interface';
import { AuthTokenResponseDto } from '../dtos/response/auth-token.response.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { MERCHANT_ADMIN_ROLE, PLATFORM_ADMIN_ROLE, AdManagerRoles, CAMPAIGN_MANAGER_ROLE } from '../constants/roles.constants';
import { v4 as uuidv4 } from 'uuid';

// Conceptual dependencies (replace with actual service/repository injections)
interface IUserRepository {
    create(userData: Partial<IUser>): Promise<IUser>;
    findById(id: string): Promise<IUser | null>;
    findByCorePlatformUserId(corePlatformUserId: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findByMerchantId(merchantId: string): Promise<IUser[]>;
    update(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    findAll(): Promise<IUser[]>; // For platform admin listing all users
}

interface IRoleRepository {
    findByName(name: string): Promise<IRole | null>;
    findAll(): Promise<IRole[]>;
}

interface ICorePlatformAuthService {
    validateCoreToken(token: string): Promise<{ corePlatformUserId: string; email: string; } | null>;
}

const DEFAULT_ROLES_DATA: IRole[] = [
    { id: uuidv4(), name: MERCHANT_ADMIN_ROLE, permissions: ['user:read_merchant', 'user:write_merchant', 'campaign:read', 'campaign:write'], description: 'Administrator for a specific merchant account.' },
    { id: uuidv4(), name: CAMPAIGN_MANAGER_ROLE, permissions: ['campaign:read', 'campaign:write'], description: 'Manages campaigns for a specific merchant.' },
    { id: uuidv4(), name: PLATFORM_ADMIN_ROLE, permissions: ['*'], description: 'Super administrator for the entire platform.' },
];

@Injectable()
export class UserAccessService {
  private readonly logger = new Logger(UserAccessService.name);
  private usersDB: IUser[] = []; // In-memory store for mock
  private rolesDB: IRole[] = [...DEFAULT_ROLES_DATA]; // In-memory store for mock

  // Conceptual Repositories/Services (mock implementations)
  private userRepository: IUserRepository = {
      create: async (userData) => {
          const newUser: IUser = {
              id: uuidv4(),
              isActive: true,
              roles: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              ...userData,
          } as IUser;
          this.usersDB.push(newUser);
          return newUser;
      },
      findById: async (id) => this.usersDB.find(user => user.id === id && user.isActive) || null,
      findByCorePlatformUserId: async (corePlatformUserId) => this.usersDB.find(user => user.corePlatformUserId === corePlatformUserId) || null,
      findByEmail: async (email) => this.usersDB.find(user => user.email === email) || null,
      findByMerchantId: async (merchantId) => this.usersDB.filter(user => user.merchantId === merchantId && user.isActive),
      update: async (id, updateData) => {
          const userIndex = this.usersDB.findIndex(user => user.id === id);
          if (userIndex === -1) return null;
          this.usersDB[userIndex] = { ...this.usersDB[userIndex], ...updateData, updatedAt: new Date() };
          return this.usersDB[userIndex];
      },
      findAll: async () => [...this.usersDB], // Returns all users, including inactive for admin purposes
  };

  private roleRepository: IRoleRepository = {
      findByName: async (name) => this.rolesDB.find(role => role.name === name) || null,
      findAll: async () => [...this.rolesDB],
  };

  private corePlatformAuthService: ICorePlatformAuthService = {
      validateCoreToken: async (token: string) => {
          if (token === 'valid-core-token-for-new-user') {
              return { corePlatformUserId: `core-${uuidv4()}`, email: `newuser-${uuidv4().substring(0,8)}@example.com` };
          }
          const existingUser = this.usersDB.find(u => u.corePlatformUserId === `core-id-for-token-${token}`);
          if (existingUser) {
              return { corePlatformUserId: existingUser.corePlatformUserId, email: existingUser.email };
          }
          if (token.startsWith('valid-core-token-')) { // Generic valid token for testing
             return { corePlatformUserId: `core-${token.split('-').pop()}`, email: `${token.split('-').pop()}@example.com` };
          }
          return null;
      },
  };

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Seed some initial users for testing if usersDB is empty
    if (this.usersDB.length === 0) {
        this.seedInitialUsers();
    }
  }

  private async seedInitialUsers() {
    const platAdminRole = await this.roleRepository.findByName(PLATFORM_ADMIN_ROLE);
    const merchAdminRole = await this.roleRepository.findByName(MERCHANT_ADMIN_ROLE);
    const campManagerRole = await this.roleRepository.findByName(CAMPAIGN_MANAGER_ROLE);

    if (platAdminRole) {
        await this.userRepository.create({
            email: 'platform.admin@example.com',
            corePlatformUserId: 'core-platform-admin-001',
            roles: [platAdminRole.name],
            isActive: true,
            merchantId: null,
        });
    }
    if (merchAdminRole) {
        await this.userRepository.create({
            email: 'merchant.admin@example.com',
            corePlatformUserId: 'core-merchant-admin-001',
            roles: [merchAdminRole.name],
            isActive: true,
            merchantId: 'merchant-001-uuid',
        });
    }
    if (campManagerRole) {
        await this.userRepository.create({
            email: 'campaign.manager@example.com',
            corePlatformUserId: 'core-campaign-manager-001',
            roles: [campManagerRole.name],
            isActive: true,
            merchantId: 'merchant-001-uuid',
        });
        await this.userRepository.create({
            email: 'another.manager@example.com',
            corePlatformUserId: 'core-campaign-manager-002',
            roles: [campManagerRole.name],
            isActive: true,
            merchantId: 'merchant-002-uuid',
        });
    }
  }

  async validateUserWithCorePlatform(corePlatformToken: string): Promise<IUser> {
    const coreUserData = await this.corePlatformAuthService.validateCoreToken(corePlatformToken);

    if (!coreUserData) {
      throw new UnauthorizedException('Invalid core platform token.');
    }

    let user = await this.userRepository.findByCorePlatformUserId(coreUserData.corePlatformUserId);

    if (!user) {
      this.logger.log(`Provisioning new Ad Manager user for core ID: ${coreUserData.corePlatformUserId}`);
      user = await this.userRepository.create({
          corePlatformUserId: coreUserData.corePlatformUserId,
          email: coreUserData.email,
          isActive: true,
          roles: [], // No roles by default, must be assigned
          merchantId: null,
      });
    }

    if (!user.isActive) {
         throw new UnauthorizedException('User is inactive in Ad Manager.');
    }
    return user;
  }

  async generateAdManagerTokens(user: Pick<IUser, 'id' | 'roles' | 'email' | 'corePlatformUserId' | 'merchantId'>): Promise<AuthTokenResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      corePlatformUserId: user.corePlatformUserId,
      merchantId: user.merchantId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshTokenExpiresIn = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d');
    let refreshToken: string | undefined;

    if (refreshTokenSecret) {
         const refreshPayload = { sub: user.id };
         refreshToken = this.jwtService.sign(refreshPayload, {
             secret: refreshTokenSecret,
             expiresIn: refreshTokenExpiresIn,
         });
    }

    return { accessToken, refreshToken };
  }

   async refreshToken(token: string): Promise<AuthTokenResponseDto> {
        const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
        if (!refreshTokenSecret) {
            throw new BadRequestException('Refresh token mechanism not enabled.');
        }

        try {
            const payload = this.jwtService.verify(token, { secret: refreshTokenSecret }) as { sub: string };
            const userId = payload.sub;
            const user = await this.userRepository.findById(userId);

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Invalid or expired refresh token (user not found or inactive).');
            }
            return this.generateAdManagerTokens(user);
        } catch (e) {
            this.logger.error(`Refresh token validation failed: ${e.message}`);
            throw new UnauthorizedException('Invalid or expired refresh token.');
        }
   }

  async createUser(createUserDto: CreateUserDto, requestingUser: IUser): Promise<IUser> {
    const isPlatformAdmin = requestingUser.roles.includes(PLATFORM_ADMIN_ROLE);
    const isMerchantAdmin = requestingUser.roles.includes(MERCHANT_ADMIN_ROLE) && requestingUser.merchantId;

    if (!isPlatformAdmin && !isMerchantAdmin) {
        throw new ForbiddenException('Only Platform Admins or Merchant Admins can create users.');
    }

    if (isMerchantAdmin && createUserDto.merchantId !== requestingUser.merchantId) {
        throw new ForbiddenException('Merchant Admins can only create users for their own merchant.');
    }
    if (isMerchantAdmin && !createUserDto.merchantId) { // Merchant Admin must specify their own merchant ID
        createUserDto.merchantId = requestingUser.merchantId;
    }


    if (await this.userRepository.findByCorePlatformUserId(createUserDto.corePlatformUserId)) {
        throw new BadRequestException(`User with core platform ID ${createUserDto.corePlatformUserId} already exists.`);
    }
    // Optional: Email uniqueness check
    // if (await this.userRepository.findByEmail(createUserDto.email)) {
    //     throw new BadRequestException(`User with email ${createUserDto.email} already exists.`);
    // }

    const rolesToAssign = createUserDto.roles || [];
    for (const roleName of rolesToAssign) {
        if (!(await this.roleRepository.findByName(roleName))) {
            throw new BadRequestException(`Role "${roleName}" is invalid.`);
        }
        if (isMerchantAdmin && ![MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE].includes(roleName)) {
            throw new ForbiddenException(`Merchant Admins cannot assign role "${roleName}".`);
        }
        if (isPlatformAdmin && !createUserDto.merchantId && roleName !== PLATFORM_ADMIN_ROLE) {
            // If platform admin creates a non-merchant user, only PLATFORM_ADMIN_ROLE can be assigned.
            // This is a simplification; more complex rules might exist.
            throw new BadRequestException(`Platform-scoped users can only be assigned "${PLATFORM_ADMIN_ROLE}". Invalid role: "${roleName}".`);
        }
    }

    const newUser = await this.userRepository.create({
        email: createUserDto.email,
        corePlatformUserId: createUserDto.corePlatformUserId,
        merchantId: createUserDto.merchantId || null,
        roles: rolesToAssign,
        isActive: true,
    });
    this.logger.log(`User created with ID: ${newUser.id} by user ${requestingUser.id}`);
    return newUser;
  }

  async findUserById(userId: string, requestingUser: IUser): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const isPlatformAdmin = requestingUser.roles.includes(PLATFORM_ADMIN_ROLE);
    const isSelf = requestingUser.id === userId;
    const isMerchantAdminOrManager = (requestingUser.roles.includes(MERCHANT_ADMIN_ROLE) || requestingUser.roles.includes(CAMPAIGN_MANAGER_ROLE))
                                     && requestingUser.merchantId === user.merchantId;

    if (!isPlatformAdmin && !isSelf && !isMerchantAdminOrManager) {
        throw new ForbiddenException('You do not have permission to access this user.');
    }
    return user;
  }

  async findUsersByMerchant(merchantId: string, requestingUser: IUser): Promise<IUser[]> {
    const isPlatformAdmin = requestingUser.roles.includes(PLATFORM_ADMIN_ROLE);
    const isMerchantAdminOrManagerForThisMerchant = 
        (requestingUser.roles.includes(MERCHANT_ADMIN_ROLE) || requestingUser.roles.includes(CAMPAIGN_MANAGER_ROLE))
        && requestingUser.merchantId === merchantId;

    if (!isPlatformAdmin && !isMerchantAdminOrManagerForThisMerchant) {
        throw new ForbiddenException('You do not have permission to list users for this merchant.');
    }
    return this.userRepository.findByMerchantId(merchantId);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto, requestingUser: IUser): Promise<IUser> {
    const userToUpdate = await this.userRepository.findById(userId);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const isPlatformAdmin = requestingUser.roles.includes(PLATFORM_ADMIN_ROLE);
    const isMerchantAdmin = requestingUser.roles.includes(MERCHANT_ADMIN_ROLE) && requestingUser.merchantId === userToUpdate.merchantId;
    // Self-update might be allowed for certain fields, but this endpoint is admin-focused.

    if (!isPlatformAdmin && !isMerchantAdmin) {
         throw new ForbiddenException('You do not have permission to update this user.');
    }

    const updatePayload: Partial<IUser> = {};

    if (updateUserDto.email !== undefined && updateUserDto.email !== userToUpdate.email) {
        // Email change logic usually tied to core platform or more complex verification
        throw new BadRequestException('Email update is not supported via this endpoint or requires verification.');
    }

    if (updateUserDto.isActive !== undefined) {
        if (requestingUser.id === userId && updateUserDto.isActive === false) {
            throw new BadRequestException('You cannot deactivate your own account.');
        }
        updatePayload.isActive = updateUserDto.isActive;
    }

    if (updateUserDto.roles !== undefined) {
        for (const roleName of updateUserDto.roles) {
            if (!(await this.roleRepository.findByName(roleName))) {
                throw new BadRequestException(`Role "${roleName}" is invalid.`);
            }
            if (isMerchantAdmin && ![MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE].includes(roleName)) {
                throw new ForbiddenException(`Merchant Admins cannot assign role "${roleName}".`);
            }
            // Platform admin specific role validation during update
            if (isPlatformAdmin && !userToUpdate.merchantId && roleName !== PLATFORM_ADMIN_ROLE && updateUserDto.roles.includes(roleName)) {
                 throw new BadRequestException(`Platform-scoped users can only be assigned "${PLATFORM_ADMIN_ROLE}". Invalid role: "${roleName}".`);
            }
        }
        if (isPlatformAdmin && requestingUser.id === userId && userToUpdate.roles.includes(PLATFORM_ADMIN_ROLE) && !updateUserDto.roles.includes(PLATFORM_ADMIN_ROLE)) {
            throw new BadRequestException('Platform Admins cannot remove their own Platform Administrator role.');
        }
        updatePayload.roles = updateUserDto.roles;
    }

    const updatedUser = await this.userRepository.update(userId, updatePayload);
    if (!updatedUser) throw new InternalServerErrorException('Failed to update user.');
    this.logger.log(`User ID: ${userId} updated by user ${requestingUser.id}. Changes: ${JSON.stringify(updatePayload)}`);
    return updatedUser;
  }

  async assignRoleToUser(userId: string, roleName: string, requestingUser: IUser): Promise<IUser> {
    const userToUpdate = await this.userRepository.findById(userId);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const roleToAdd = await this.roleRepository.findByName(roleName);
    if (!roleToAdd) {
        throw new BadRequestException(`Role "${roleName}" not found.`);
    }

    const isPlatformAdmin = requestingUser.roles.includes(PLATFORM_ADMIN_ROLE);
    const isMerchantAdmin = requestingUser.roles.includes(MERCHANT_ADMIN_ROLE) && requestingUser.merchantId === userToUpdate.merchantId;

    if (!isPlatformAdmin && !isMerchantAdmin) {
         throw new ForbiddenException('Only authorized administrators can assign roles.');
    }
    if (isMerchantAdmin && ![MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE].includes(roleName)) {
         throw new ForbiddenException(`Merchant Admins cannot assign the role "${roleName}".`);
    }
    if (isPlatformAdmin && !userToUpdate.merchantId && roleName !== PLATFORM_ADMIN_ROLE) {
        throw new BadRequestException(`Cannot assign role "${roleName}" to a platform-scoped user. Only "${PLATFORM_ADMIN_ROLE}" is allowed.`);
    }

    const newRoles = Array.from(new Set([...userToUpdate.roles, roleName]));
    const updatedUser = await this.userRepository.update(userId, { roles: newRoles });
    if (!updatedUser) throw new InternalServerErrorException('Failed to assign role to user.');
    this.logger.log(`Role "${roleName}" assigned to user ID: ${userId} by user ${requestingUser.id}`);
    return updatedUser;
  }

  async getRoles(): Promise<IRole[]> {
    return this.roleRepository.findAll();
  }

  async getRoleByName(roleName: string): Promise<IRole> {
     const role = await this.roleRepository.findByName(roleName);
     if (!role) {
         throw new NotFoundException(`Role with name "${roleName}" not found.`);
     }
     return role;
  }

   async checkUserPermissionForMerchant(userId: string, merchantId: string, requiredRole: string): Promise<boolean> {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.isActive) return false;
        if (user.merchantId !== merchantId) return false;
        if (!user.roles.includes(requiredRole)) return false;
        return true;
   }

   async platformAdminListAllUsers(requestingUser: IUser): Promise<IUser[]> {
       if (!requestingUser.roles.includes(PLATFORM_ADMIN_ROLE)) {
           throw new ForbiddenException('Only Platform Admins can list all users.');
       }
       this.logger.log(`Platform Admin user ${requestingUser.id} listing all users.`);
       return this.userRepository.findAll();
   }

    // This method name matches the one called by PlatformAdminUsersController as per SDS 4.6.4
   async platformAdminGetAnyUserById(userId: string, requestingUser: IUser): Promise<IUser> {
       if (!requestingUser.roles.includes(PLATFORM_ADMIN_ROLE)) {
           throw new ForbiddenException('Only Platform Admins can access any user by ID.');
       }
       this.logger.log(`Platform Admin user ${requestingUser.id} attempting to get user ID: ${userId}`);
       const user = await this.userRepository.findById(userId); // findById now includes inactive users for admin
       if (!user) {
           throw new NotFoundException(`User with ID ${userId} not found.`);
       }
       return user;
   }

    async platformAdminUpdateUser(userId: string, updateUserDto: UpdateUserDto, requestingUser: IUser): Promise<IUser> {
       if (!requestingUser.roles.includes(PLATFORM_ADMIN_ROLE)) {
           throw new ForbiddenException('Only Platform Admins can update any user.');
       }
       
       const userToUpdate = await this.userRepository.findById(userId); // Use a method that finds user regardless of active status for admin
        if (!userToUpdate) {
            const allUsersForDebug = await this.userRepository.findAll();
            this.logger.debug(`User not found by ID ${userId}. All users: ${JSON.stringify(allUsersForDebug.map(u => u.id))}`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }


       this.logger.log(`Platform Admin user ${requestingUser.id} attempting to update user ID: ${userId} with data: ${JSON.stringify(updateUserDto)}`);
       // Re-use general updateUser logic but with platform admin context, which is already handled by role checks in updateUser
       // The general updateUser method now includes checks for platform admin
       // For specific platform admin overrides not covered by general updateUser:
       const updatePayload: Partial<IUser> = {};

       if (updateUserDto.email !== undefined && updateUserDto.email !== userToUpdate.email) {
            throw new BadRequestException('Email update is not supported via this endpoint, even by Platform Admin.');
       }

       if (updateUserDto.isActive !== undefined) {
            if (requestingUser.id === userId && updateUserDto.isActive === false && userToUpdate.roles.includes(PLATFORM_ADMIN_ROLE)) {
               throw new BadRequestException('Platform Admins cannot deactivate their own account.');
           }
            updatePayload.isActive = updateUserDto.isActive;
       }

       if (updateUserDto.roles !== undefined) {
           for (const roleName of updateUserDto.roles) {
               if (!(await this.roleRepository.findByName(roleName))) {
                   throw new BadRequestException(`Role "${roleName}" is invalid.`);
               }
           }
           if (requestingUser.id === userId && userToUpdate.roles.includes(PLATFORM_ADMIN_ROLE) && !updateUserDto.roles.includes(PLATFORM_ADMIN_ROLE)) {
               throw new BadRequestException('Platform Admins cannot remove their own Platform Administrator role.');
           }
           updatePayload.roles = updateUserDto.roles;
       }
       
       const updatedUser = await this.userRepository.update(userId, updatePayload);
       if (!updatedUser) throw new InternalServerErrorException('Failed to update user by Platform Admin.');
       this.logger.log(`User ID: ${userId} updated by Platform Admin ${requestingUser.id}. Changes: ${JSON.stringify(updatePayload)}`);
       return updatedUser;
    }
}