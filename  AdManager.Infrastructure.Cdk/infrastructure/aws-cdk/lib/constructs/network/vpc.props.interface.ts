import * as cdk from 'aws-cdk-lib';
import { EnvironmentName } from '../../config/environment.enum';

/**
 * Properties for the VpcConstruct.
 */
export interface VpcProps {
  /**
   * The CIDR block for the VPC.
   */
  readonly vpcCidr: string;

  /**
   * The maximum number of Availability Zones to use for this VPC.
   * @example 2 for Dev/Staging, 3 for Prod
   */
  readonly maxAzs: number;

  /**
   * The number of NAT Gateways to create.
   * Can be 0 for dev if no outbound private access needed, or 1 per AZ for prod.
   * @default - Determined by environment (1 for non-PROD, maxAzs for PROD if multiAzEnabled, else 1)
   */
  readonly natGatewaysCount?: number;

  /**
   * The name of the environment (e.g., dev, staging, prod).
   */
  readonly envName: EnvironmentName;

  /**
   * The name of the application.
   */
  readonly appName: string;

  /**
   * Specifies the subnet configuration for the VPC.
   * @default - Default subnets are created: Public, PrivateApp (with NAT), PrivateDb (isolated).
   */
  readonly subnetConfiguration?: cdk.aws_ec2.SubnetConfiguration[];
}