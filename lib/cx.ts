import cdk = require('@aws-cdk/core');
import waf = require('@aws-cdk/aws-wafv2');

export interface WafCidrsProps {
  /**
   * A proper name
   */
  readonly serviceName: string;
  /**
   * Allowed cidrs
   */
  readonly allowCidrs: string[];
}

export class WafCidrs extends cdk.Construct {
  public static readonly helixCorporatePublicIps: string[] = [
    '4.14.41.98/32',
    '209.133.7.15/32',
    '4.14.44.214/32',
    '64.124.193.15/32',
    '50.209.176.85/32',
    '128.177.83.229/32',
  ];

  public readonly cfnWebAcl: waf.CfnWebACL;

  constructor(scope: cdk.Construct, id: string, props: WafCidrsProps) {
    super(scope, id);

    const ipSet = new waf.CfnIPSet(this, 'IpSet', {
      name: `${props.serviceName}-allowed-ips`,
      addresses: props.allowCidrs,
      ipAddressVersion: 'IPV4',
      scope: 'CLOUDFRONT',
    });

    this.cfnWebAcl = new waf.CfnWebACL(this, 'WebAcl', {
      defaultAction: { block: {} },
      name: props.serviceName,
      scope: 'CLOUDFRONT',
      rules: [
        {
          name: `${props.serviceName}-allow-ips`,
          action: { allow: {} },
          priority: 1,
          statement: {
            ipSetReferenceStatement: { arn: ipSet.ref },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: false,
            metricName: 'none',
            sampledRequestsEnabled: false,
          },
        },
      ],
      rules: [  // ST advised
        {
          name: `${props.serviceName}-allow-ips`,
          action: { allow: {} },
          priority: 1,
          statement: {
            ipSetReferenceStatement: {ipSet.arn },  // !!
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: false,
            metricName: 'none',
            sampledRequestsEnabled: false,
          },
        },
      ],
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: `${props.serviceName}-metrics`,
        sampledRequestsEnabled: true,
      },
    });
  }
}
