import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IEnvironmentConfig, EnvironmentName } from '../config/app-config.interface';
import { VpcConstruct } from '../constructs/network/vpc.construct';
// Assuming generateResourceName is available in utils
// import { generateResourceName } from '../utils/name-generator';

export interface NetworkStackProps extends cdk.StackProps {
  readonly appConfig: IEnvironmentConfig;
}

/**
 * Defines and deploys the core networking infrastructure for the Ad Manager platform.
 * This includes the VPC, subnets, route tables, and foundational security groups.
 * It utilizes the VpcConstruct for creating the VPC.
 */
export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const { appConfig } = props;

    // Determine maxAzs based on environment and multiAzEnabled configuration
    let maxAzs: number;
    if (appConfig.multiAzEnabled) {
      maxAzs = appConfig.envName === EnvironmentName.PROD ? 3 : 2;
    } else {
      maxAzs = 1;
    }

    // Determine natGatewaysCount based on environment and multiAzEnabled configuration
    let natGatewaysCount: number;
    if (appConfig.multiAzEnabled) {
      natGatewaysCount = appConfig.envName === EnvironmentName.PROD ? maxAzs : 1;
    } else {
      // For non-multiAZ, only provide NAT gateway if not DEV environment, or if DEV needs it (here, 0 for DEV)
      natGatewaysCount = appConfig.envName !== EnvironmentName.DEV ? 1 : 0;
    }
    
    // The VpcConstruct handles the actual resource naming internally using generateResourceName
    const vpcConstruct = new VpcConstruct(this, 'PlatformVpc', {
      vpcCidr: appConfig.vpcCidr,
      maxAzs: maxAzs,
      natGatewaysCount: natGatewaysCount,
      envName: appConfig.envName,
      appName: appConfig.appName,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'PrivateApp',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'PrivateDb',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    this.vpc = vpcConstruct.vpc;

    // Output VPC ID
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      description: 'The ID of the VPC',
      exportName: `${appConfig.appName}-${appConfig.envName}-VpcId`,
    });

    // Output Public Subnet IDs
    new cdk.CfnOutput(this, 'PublicSubnetIds', {
      value: this.vpc.publicSubnets.map(subnet => subnet.subnetId).join(','),
      description: 'Comma-separated list of Public Subnet IDs',
      exportName: `${appConfig.appName}-${appConfig.envName}-PublicSubnetIds`,
    });

    // Output Private Application Subnet IDs
    new cdk.CfnOutput(this, 'PrivateAppSubnetIds', {
      value: this.vpc.privateSubnets.map(subnet => subnet.subnetId).join(','),
      description: 'Comma-separated list of Private Application Subnet IDs',
      exportName: `${appConfig.appName}-${appConfig.envName}-PrivateAppSubnetIds`,
    });
    
    // Output Private Database Subnet IDs
    new cdk.CfnOutput(this, 'PrivateDbSubnetIds', {
        value: this.vpc.isolatedSubnets.map(subnet => subnet.subnetId).join(','),
        description: 'Comma-separated list of Private Database Subnet IDs',
        exportName: `${appConfig.appName}-${appConfig.envName}-PrivateDbSubnetIds`,
    });
  }
}