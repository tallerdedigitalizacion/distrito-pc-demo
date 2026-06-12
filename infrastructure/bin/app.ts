#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ContactStack } from '../lib/contact-stack';

const app = new cdk.App();

new ContactStack(app, 'DistritoPC-ContactStack', {
  env: {
    // Set via CDK_DEFAULT_ACCOUNT / CDK_DEFAULT_REGION or hardcode:
    // account: '123456789012',
    // region: 'eu-west-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-1',
  },
  tags: {
    Project:     'DistritoPC',
    Environment: 'production',
  },
});
