import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { EnvironmentName } from '../../config/environment.enum';

/**
 * Properties for the FargateServiceConstruct.
 */
export interface FargateServiceProps {
  /** The ECS cluster to host this service. */
  readonly cluster: ecs.ICluster;

  /** The VPC where the service will be deployed. */
  readonly vpc: ec2.IVpc;

  /**
   * Options for the main container image of the task definition.
   * This can be for an ApplicationLoadBalancedTaskImageOptions or NetworkLoadBalancedTaskImageOptions.
   */
  readonly taskImageOptions: ecs_patterns.ApplicationLoadBalancedTaskImageOptions | ecs_patterns.NetworkLoadBalancedTaskImageOptions;

  /**
   * The number of CPU units to reserve for the container.
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory to reserve for the container.
   * @default 512
   */
  readonly memoryLimitMiB?: number;

  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   * @default 1 for dev, 2+ for prod
   */
  readonly desiredCount?: number;

  /**
   * The name of the service.
   */
  readonly serviceName: string;

  /**
   * The type of load balancer to create.
   */
  readonly loadBalancerType: 'ALB' | 'NLB';

  /**
   * Determines Dhether the Load Balancer faced to the public internet or is internal.
   * @default true for ALB, NLB behavior might vary based on ecs_patterns implementation.
   */
  readonly publicLoadBalancer?: boolean;

  /**
   * The path for the health check on the load balancer.
   * Relevant for ALB.
   * @default '/'
   */
  readonly healthCheckPath?: string;

  /**
   * The grace period for the health check.
   * @default cdk.Duration.seconds(60)
   */
  readonly healthCheckGracePeriod?: cdk.Duration;

  /**
   * The minimum number of tasks for auto-scaling.
   */
  readonly minScalingCapacity?: number;

  /**
   * The maximum number of tasks for auto-scaling.
   */
  readonly maxScalingCapacity?: number;

  /**
   * The target CPU utilization percentage for CPU-based auto-scaling.
   */
  readonly cpuScalingTargetUtilizationPercent?: number;

  /**
   * The target memory utilization percentage for memory-based auto-scaling.
   */
  readonly memoryScalingTargetUtilizationPercent?: number;

  /**
   * The subnets to use for the Fargate tasks.
   * @default - Private subnets with egress.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Specifies whether to assign a public IP address to the Fargate tasks.
   * Typically false for tasks behind a load balancer in private subnets.
   * True might be needed for public NLB tasks.
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /** The name of the environment (e.g., dev, staging, prod). */
  readonly envName: EnvironmentName;

  /** The name of the application. */
  readonly appName: string;
}