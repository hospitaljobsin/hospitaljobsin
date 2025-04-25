// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "accounts",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const myVpc = sst.aws.Vpc.get("MyVpc", {id: process.env.SST_VPC_ID});
    
    new sst.aws.Nextjs("accounts-ui", {
      buildCommand: "pnpm run package",
      domain: process.env.SST_ACCOUNTS_DOMAIN,
      environment: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
        NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL: process.env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL,
        NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL: process.env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL,
        JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
        API_URL: process.env.API_URL,
      },
      vpc: myVpc,
      server: {
        runtime: "nodejs22.x",
      }
    });
  },
});
