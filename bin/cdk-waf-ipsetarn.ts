#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkWafIpsetarnStack } from '../lib/cdk-waf-ipsetarn-stack';

const app = new cdk.App();
new CdkWafIpsetarnStack(app, 'CdkWafIpsetarnStack');
