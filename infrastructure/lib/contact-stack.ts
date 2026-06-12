import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';
import * as path from 'path';

export interface ContactStackProps extends cdk.StackProps {
  /**
   * Email verified in SES that will appear as the sender (From:).
   * Defaults to noreply@distritopc.com — must be verified in SES.
   */
  fromEmail?: string;

  /**
   * Email address that receives the contact form submissions.
   * Defaults to tecnico@distritopc.com — must be verified in SES (sandbox mode)
   * or the domain must be verified for production.
   */
  toEmail?: string;

  /**
   * Allowed CORS origin for the API. Should be your site domain.
   * Defaults to https://www.distritopc.com
   */
  corsOrigin?: string;
}

export class ContactStack extends cdk.Stack {
  /** The HTTPS URL of the contact API endpoint, exported for use in the Astro env. */
  public readonly apiUrl: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props: ContactStackProps = {}) {
    super(scope, id, props);

    const fromEmail  = props.fromEmail  ?? 'noreply@distritopc.com';
    const toEmail    = props.toEmail    ?? 'tecnico@distritopc.com';
    const corsOrigin = props.corsOrigin ?? 'https://www.distritopc.com';

    // ── IAM Role ────────────────────────────────────────────────
    const lambdaRole = new iam.Role(this, 'ContactLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });

    // Minimum SES permissions: send email only
    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      }),
    );

    // ── Lambda ───────────────────────────────────────────────────
    const contactFn = new lambda.Function(this, 'ContactFunction', {
      runtime:     lambda.Runtime.NODEJS_20_X,
      handler:     'index.handler',
      code:        lambda.Code.fromAsset(
        path.join(__dirname, 'lambda'),
      ),
      role:        lambdaRole,
      timeout:     cdk.Duration.seconds(15),
      memorySize:  256,
      description: 'DistritoPC contact form — sends email via SES',
      environment: {
        FROM_EMAIL:   fromEmail,
        TO_EMAIL:     toEmail,
        CORS_ORIGIN:  corsOrigin,
        REGION:       this.region,
      },
    });

    // ── HTTP API (API Gateway v2) ────────────────────────────────
    const httpApi = new apigateway.HttpApi(this, 'ContactApi', {
      apiName:     'distritopc-contact-api',
      description: 'Contact form endpoint for DistritoPC',
      corsPreflight: {
        allowOrigins: [corsOrigin, 'http://localhost:4321'],
        allowMethods: [apigateway.CorsHttpMethod.POST, apigateway.CorsHttpMethod.OPTIONS],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge:       cdk.Duration.days(1),
      },
    });

    httpApi.addRoutes({
      path:        '/contact',
      methods:     [apigateway.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        'ContactIntegration',
        contactFn,
      ),
    });

    // ── Outputs ──────────────────────────────────────────────────
    this.apiUrl = new cdk.CfnOutput(this, 'ContactApiUrl', {
      value:       `${httpApi.apiEndpoint}/contact`,
      description: 'Set this as PUBLIC_CONTACT_API_URL in your Astro .env file',
      exportName:  'DistritoPC-ContactApiUrl',
    });

    // Remind about SES verification
    new cdk.CfnOutput(this, 'SESVerificationReminder', {
      value: [
        `Verify sender: ${fromEmail}`,
        `Verify recipient: ${toEmail}`,
        'Run: aws ses verify-email-identity --email-address <addr> --region ' + this.region,
        'Or verify the domain distritopc.com for production.',
      ].join(' | '),
      description: 'SES email verification steps required before use',
    });
  }
}
