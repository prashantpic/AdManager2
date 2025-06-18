import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { FargateServiceProps } from './fargate-service.props.interface';
import { generateResourceName } from '../../utils/name-generator';
import { EnvironmentName } from '../../config/environment.enum';


export class FargateServiceConstruct extends Construct {
  public readonly service: ecs.FargateService;
  public readonly loadBalancer?: elbv2.IApplicationLoadBalancer | elbv2.INetworkLoadBalancer;
  public readonly listener?: elbv2.IApplicationListener | elbv2.INetworkListener;

  constructor(scope: Construct, id: string, props: FargateServiceProps) {
    super(scope, id);

    const fargateServiceNameBase = generateResourceName({
        appName: props.appName,
        envName: props.envName,
        resourceIdentifier: props.serviceName,
      });

    let fargateServicePattern;

    if (props.loadBalancerType === 'ALB') {
      const albFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
        cluster: props.cluster,
        vpc: props.vpc,
        taskImageOptions: props.taskImageOptions as ecsPatterns.ApplicationLoadBalancedTaskImageOptions,
        cpu: props.cpu ?? 256,
        memoryLimitMiB: props.memoryLimitMiB ?? 512,
        desiredCount: props.desiredCount ?? (props.envName === EnvironmentName.PROD ? 2 : 1),
        serviceName: fargateServiceNameBase,
        publicLoadBalancer: props.publicLoadBalancer ?? true,
        taskSubnets: props.vpcSubnets ?? { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        healthCheckGracePeriod: props.healthCheckGracePeriod,
        circuitBreaker: { rollback: true },
        redirectHTTP: props.taskImageOptions.containerPort === 80 && props.publicLoadBalancer === true, // Basic redirect if on port 80
      });
      
      if(props.healthCheckPath && albFargateService.targetGroup) {
        albFargateService.targetGroup.configureHealthCheck({
            path: props.healthCheckPath,
        });
      }

      this.service = albFargateService.service;
      this.loadBalancer = albFargateService.loadBalancer;
      this.listener = albFargateService.listener;
      fargateServicePattern = albFargateService;

    } else if (props.loadBalancerType === 'NLB') {
      const nlbFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'Service', {
        cluster: props.cluster,
        vpc: props.vpc,
        taskImageOptions: props.taskImageOptions as ecsPatterns.NetworkLoadBalancedTaskImageOptions,
        cpu: props.cpu ?? 256,
        memoryLimitMiB: props.memoryLimitMiB ?? 512,
        desiredCount: props.desiredCount ?? (props.envName === EnvironmentName.PROD ? 2 : 1),
        serviceName: fargateServiceNameBase,
        publicLoadBalancer: props.publicLoadBalancer ?? true, // NLB might be internal by default, check assignPublicIp too
        taskSubnets: props.vpcSubnets ?? { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        assignPublicIp: props.assignPublicIp ?? false, // For NLB tasks, usually false
      });
      // NLB Health Check is configured differently, often via Target Group attributes directly or relies on container health.
      // The pattern might handle some defaults. Custom health check path for NLB is less direct in pattern.
      this.service = nlbFargateService.service;
      this.loadBalancer = nlbFargateService.loadBalancer;
      this.listener = nlbFargateService.listener;
      fargateServicePattern = nlbFargateService;

    } else {
        throw new Error(`Unsupported loadBalancerType: ${props.loadBalancerType}`);
    }

    if (props.minScalingCapacity && props.maxScalingCapacity) {
      const scalableTarget = this.service.autoScaleTaskCount({
        minCapacity: props.minScalingCapacity,
        maxCapacity: props.maxScalingCapacity,
      });

      if (props.cpuScalingTargetUtilizationPercent) {
        scalableTarget.scaleOnCpuUtilization('CpuScaling', {
          targetUtilizationPercent: props.cpuScalingTargetUtilizationPercent,
          scaleInCooldown: cdk.Duration.seconds(60),
          scaleOutCooldown: cdk.Duration.seconds(60),
        });
      }

      if (props.memoryScalingTargetUtilizationPercent) {
        scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
          targetUtilizationPercent: props.memoryScalingTargetUtilizationPercent,
          scaleInCooldown: cdk.Duration.seconds(60),
          scaleOutCooldown: cdk.Duration.seconds(60),
        });
      }
    }

    cdk.Tags.of(fargateServicePattern).add('Application', props.appName);
    cdk.Tags.of(fargateServicePattern).add('Environment', props.envName);
    cdk.Tags.of(fargateServicePattern).add('ServiceName', props.serviceName); // Specific service identifier
  }
}