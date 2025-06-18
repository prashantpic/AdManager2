import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as kms from 'aws-cdk-lib/aws-kms';
import { RdsInstanceProps } from './rds-instance.props.interface';
import { generateResourceName } from '../../utils/name-generator';
import { EnvironmentName } from '../../config/environment.enum';

export class RdsInstanceConstruct extends Construct {
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbCredentialsSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: RdsInstanceProps) {
    super(scope, id);

    const dbInstanceIdentifier = generateResourceName({
      appName: props.appName,
      envName: props.envName,
      resourceIdentifier: props.databaseName, // Use databaseName for instance identifier part
      maxLength: 63, // RDS instance identifier max length
    });
    
    const secretName = props.masterUserPasswordSecretName || generateResourceName({
        appName: props.appName,
        envName: props.envName,
        resourceIdentifier: `${props.databaseName}-master-credentials`,
      });

    this.dbCredentialsSecret = new secretsmanager.Secret(this, 'DBCredentialsSecret', {
      secretName: secretName,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: props.masterUsername }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
        passwordLength: 16,
      },
    });

    const majorVersion = props.engineVersionString.split('.')[0];
    const postgresEngineVersion = rds.PostgresEngineVersion.of(props.engineVersionString, majorVersion);

    const defaultVpcSubnets: ec2.SubnetSelection = {
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    };
    
    // Create a new security group for the RDS instance
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
        vpc: props.vpc,
        description: `Security group for RDS instance ${props.databaseName}`,
        allowAllOutbound: true,
    });
    // Add ingress rule if needed, for example, from an application security group.
    // This is typically done in the stack wiring the components.

    this.dbInstance = new rds.DatabaseInstance(this, 'DatabaseInstance', {
      vpc: props.vpc,
      engine: rds.DatabaseInstanceEngine.postgres({ version: postgresEngineVersion }),
      instanceType: props.instanceType,
      databaseName: props.databaseName,
      credentials: rds.Credentials.fromSecret(this.dbCredentialsSecret),
      instanceIdentifier: dbInstanceIdentifier,
      multiAz: props.multiAz ?? (props.envName === EnvironmentName.PROD),
      allocatedStorage: props.allocatedStorage ?? 20, // GB
      backupRetention: props.backupRetention ?? cdk.Duration.days(props.envName === EnvironmentName.PROD ? 30 : 7),
      vpcSubnets: props.vpcSubnets ?? defaultVpcSubnets,
      securityGroups: props.securityGroups ? [...props.securityGroups, dbSecurityGroup] : [dbSecurityGroup],
      deletionProtection: props.deletionProtection ?? (props.envName === EnvironmentName.PROD),
      storageEncrypted: props.storageEncrypted ?? true,
      kmsKey: props.kmsKey, // Pass custom KMS key if provided
      autoMinorVersionUpgrade: true,
      cloudwatchLogsExports: ['postgresql', 'upgrade'], // Common logs to export
      cloudwatchLogsRetention: cdk.aws_logs.RetentionDays.ONE_MONTH, // Example retention
      allowMajorVersionUpgrade: false, // Control major version upgrades manually
      parameterGroup: new rds.ParameterGroup(this, 'PostgresParameterGroup', { // Example custom parameter group
        engine: rds.DatabaseInstanceEngine.postgres({ version: postgresEngineVersion }),
        description: `Custom parameter group for ${dbInstanceIdentifier}`,
        parameters: {
          // 'rds.logical_replication': '1', // Example if using logical replication
        },
      }),
      monitoringInterval: cdk.Duration.minutes(1), // Enhanced monitoring
      storageType: rds.StorageType.GP2, // General Purpose SSD
      copyTagsToSnapshot: true,
    });

    cdk.Tags.of(this.dbInstance).add('Name', dbInstanceIdentifier);
    cdk.Tags.of(this.dbInstance).add('Application', props.appName);
    cdk.Tags.of(this.dbInstance).add('Environment', props.envName);
    cdk.Tags.of(this.dbInstance).add('DatabaseName', props.databaseName);
  }
}