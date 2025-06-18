import {
  APIGatewayTokenAuthorizerEvent,
  Context,
  AuthResponse,
  Statement,
  PolicyDocument
} from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import { JwksClient, RsaSigningKey } from 'jwks-rsa';
import { generatePolicy } from './auth-policy';

// Environment variables (REQ-03-004: Configuration for Lambda)
const JWKS_URI = process.env.JWKS_URI;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE_STRING = process.env.JWT_AUDIENCE; // Comma-separated string

if (!JWKS_URI || !JWT_ISSUER || !JWT_AUDIENCE_STRING) {
  console.error('Missing required environment variables: JWKS_URI, JWT_ISSUER, JWT_AUDIENCE');
  // This configuration error should ideally prevent Lambda deployment or cause immediate failure.
  // For runtime, we'll deny requests, but this indicates a setup issue.
}

const jwtAudience = JWT_AUDIENCE_STRING ? JWT_AUDIENCE_STRING.split(',').map(aud => aud.trim()) : [];

const client = new JwksClient({
  jwksUri: JWKS_URI!,
  cache: true, // Enable caching of signing keys.
  cacheMaxEntries: 5, // Default is 10
  cacheMaxAge: cổngDuration.hours(10).toMilliseconds(), // Default is 10 hours
  rateLimit: true, // Enable rate limiting for JWKS fetching.
  jwksRequestsPerMinute: 10, // Default is 10
});

/**
 * Extracts the JWT from the authorization header.
 * Expects "Bearer <token>".
 */
function extractToken(event: APIGatewayTokenAuthorizerEvent): string | null {
  if (!event.authorizationToken) {
    console.log('No authorizationToken found in event');
    return null;
  }

  const tokenParts = event.authorizationToken.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    console.log('Authorization token is not a valid Bearer token format');
    return null;
  }
  return tokenParts[1];
}

/**
 * Callback function for jsonwebtoken.verify to fetch the signing key from JWKS.
 */
const getKey = (header: jwt.JwtHeader, callback: (err: Error | null, key?: string | Buffer) => void): void => {
  if (!header.kid) {
    callback(new Error('Token KID (Key ID) is missing in header'));
    return;
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Error fetching signing key from JWKS:', err);
      callback(err);
      return;
    }
    // key can be RsaSigningKey or EcdsaSigningKey. Ensure it's what you expect or handle both.
    const signingKey = (key as RsaSigningKey).publicKey || (key as RsaSigningKey).rsaPublicKey; // Handle both properties for compatibility
    if (!signingKey) {
        callback(new Error('Signing key could not be retrieved from JWKS response.'));
        return;
    }
    callback(null, signingKey);
  });
};

/**
 * Lambda handler for JWT authorization.
 * (3.2.4, REQ-IAM-007, REQ-03-004)
 */
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context
): Promise<AuthResponse> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!JWKS_URI || !JWT_ISSUER || jwtAudience.length === 0) {
    console.error('Authorizer misconfigured: Missing JWKS_URI, JWT_ISSUER, or JWT_AUDIENCE.');
    return generatePolicy('configuration_error_user', 'Deny', event.methodArn);
  }

  const token = extractToken(event);

  if (!token) {
    console.log('Unauthorized: No token provided or malformed token.');
    // API Gateway will return 401 Unauthorized if 'Unauthorized' is thrown.
    // For custom authorizers, returning a Deny policy leads to 403 Forbidden.
    // To strictly enforce 401, you might throw 'Unauthorized'.
    // However, the standard practice is to return a Deny policy.
    return generatePolicy('unauthorized_user', 'Deny', event.methodArn);
  }

  try {
    const decodedToken = await new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: JWT_ISSUER,
          audience: jwtAudience,
          algorithms: ['RS256'], // Specify the allowed algorithms, RS256 is common for JWKS
        },
        (err, decoded) => {
          if (err) {
            console.error('JWT verification failed:', err.message, err.name);
            reject(err);
          } else {
            resolve(decoded as jwt.JwtPayload);
          }
        }
      );
    });

    if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.sub) {
      console.log('Unauthorized: Invalid token payload or missing "sub" claim.');
      return generatePolicy('invalid_token_payload_user', 'Deny', event.methodArn);
    }

    const principalId = decodedToken.sub; // 'sub' (subject) claim is typically used as principalId
    console.log(`Successfully validated token for principal: ${principalId}`);

    // Optional: Coarse-grained authorization based on claims (e.g., roles, scopes)
    // const roles = decodedToken.roles || []; // Example: 'roles' claim
    // if (!roles.includes('access-merchant-api')) {
    //   console.log(`Principal ${principalId} lacks required role 'access-merchant-api'.`);
    //   return generatePolicy(principalId, 'Deny', event.methodArn);
    // }

    // Context object to pass to backend integrations
    // This context is only available if using a REQUEST based authorizer.
    // For TOKEN based authorizers, only principalId and policyDocument are returned.
    // If you need to pass claims, switch to a Request authorizer.
    const authorizerContext: { [key: string]: string | number | boolean } = {
      principalId: principalId,
      userId: decodedToken.sub, // often same as principalId
      // Add other relevant claims from decodedToken that backend services might need.
      // E.g., tenantId: decodedToken.tenant_id,
      // userRoles: JSON.stringify(roles)
    };
    
    // For TOKEN authorizer, context is not passed directly this way.
    // It's for REQUEST authorizer. However, some API Gateway versions might support it limitedly.
    // The primary return for TOKEN authorizer is principalId and PolicyDocument.

    console.log(`Generating Allow policy for principal: ${principalId} on resource: ${event.methodArn}`);
    return generatePolicy(principalId, 'Allow', event.methodArn, authorizerContext);

  } catch (error: any) {
    console.error('Authorization error during token processing:', error.message, error.name);
    // Handle specific JWT errors if needed (e.g., TokenExpiredError, JsonWebTokenError)
    // For any error during verification, deny access.
    return generatePolicy('error_processing_token_user', 'Deny', event.methodArn);
  }
};