import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { VpcProps } from './vpc.props.interface';
import { generateResourceName } from '../../utils/name-generator';
import { EnvironmentName } from '../../config/environment.enum';

export class VpcConstruct extends Construct {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id);

    const vpcName = generateResourceName({
      appName: props.appName,
      envName: props.envName,
      resourceIdentifier: id, // Use the construct id for resource identifier part of the name
    });

    const defaultSubnetConfiguration: ec2.SubnetConfiguration[] = [
      {
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
        cidrMask: 24,
      },
      {
        name: 'PrivateApp',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24,
      },
      {
        name: 'PrivateDb',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        cidrMask: 28,
      },
    ];

    this.vpc = new ec2.Vpc(this, 'Resource', {
      vpcName: vpcName,
      ipAddresses: ec2.IpAddresses.cidr(props.vpcCidr),
      maxAzs: props.maxAzs,
      natGateways: props.natGatewaysCount ?? (props.envName === EnvironmentName.PROD ? props.maxAzs : 1),
      subnetConfiguration: props.subnetConfiguration ?? defaultSubnetConfiguration,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    cdk.Tags.of(this.vpc).add('Name', vpcName);
    cdk.Tags.of(this.vpc).add('Application', props.appName);
    cdk.Tags.of(this.vpc).add('Environment', props.envName);
  }
}