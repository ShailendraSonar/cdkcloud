// import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';

export class CloudFormationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // Create VPC
   const vpc = new ec2.Vpc(this, 'MyVpc', {
    maxAzs: 2, // Use 2 Availability Zones
  });

  // Create EC2 Instance
  const ec2Instance = new ec2.Instance(this, 'MyEC2Instance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.latestAmazonLinux(),
    vpc,
  });

  // Create S3 Bucket
  const s3Bucket = new s3.Bucket(this, 'MyS3Bucket');

  const elasticIp = new ec2.CfnEIP(this, 'MyEIP');

  // Associate the Elastic IP with the EC2 instance
  new ec2.CfnEIPAssociation(this, 'MyEIPAssociation', {
    allocationId: elasticIp.attrAllocationId,
    instanceId: ec2Instance.instanceId,
  });

  }
}
