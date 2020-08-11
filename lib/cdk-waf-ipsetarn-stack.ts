import * as cdk from '@aws-cdk/core';
import * as wafv2 from '@aws-cdk/aws-wafv2';
import { CfnIPSet, CfnWebACL } from "@aws-cdk/aws-wafv2";

export class CdkWafIpsetarnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const testIpSet = new CfnIPSet(this, "IPSet", {
      ipAddressVersion: "IPV4",
      scope: "REGIONAL",
      addresses: [
        "1.2.3.4/32"
      ],
    });

    const myTestWaf = new wafv2.CfnWebACL(this, 'CDNWAF' ,{
      scope: 'REGIONAL',
      defaultAction: {allow: {}},
      rules: [
        {
          action: {
            block: {}
          },
          priority: 1,
          visibilityConfig: {
            cloudWatchMetricsEnabled: false,
            metricName: "Test",
            sampledRequestsEnabled: false,
          },
          name: "MyTestRule1",
          statement: {
            ipSetReferenceStatement: {
              arn: testIpSet.attrArn
            }
          },
        },
      ],
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        metricName: "Test",
        sampledRequestsEnabled: false,
      }
    })
  }
}