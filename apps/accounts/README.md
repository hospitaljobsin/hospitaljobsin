# PulseWork Accounts
> *Accounts/ Authentication UI for PulseWork*

## Tech Stack
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [React.js](https://react.dev) - UI library
- [Next.js](https://nextjs.org) - React metaframework
- [HeroUI](https://heroui.com/) - Component library
- [React Hook Form](https://react-hook-form.com/) - Form library
- [XState](https://xstate.js.org/) - State management library
- [Zod](https://zod.dev/) - Schema validation library
- [Relay](https://relay.dev/) - GraphQL client
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Simple WebAuthn](https://simplewebauthn.dev/) - WebAuthn library
- [Framer Motion](https://motion.dev/) - Animation library

and other packages from [package.json](./package.json) 💖

## Setup Guide

### Prerequisites
| Tool                                                  | Minimum Tested Version | Description              |
|-------------------------------------------------------|------------------------|--------------------------|
| [Node.js](https://nodejs.org/en)                      | v20.18                 | Javascript Runtime       |
| [PNPM](https://pnpm.io/)                              | 9.15                   | Package Manager          |
| [Watchman](https://facebook.github.io/watchman/)      | 2024.10.28.00          | File Watching Service    |

1. Install dependencies
```bash
pnpm install
```

2. Set Environment variables
Create a `.env` file, referencing the template [here](./.env.example)

- To set the `RSA_PUBLIC_KEY` variable, Obtain the public key from the RSA key pair generated while setting up the server, replacing `\n` with `\\n` to ensure the key fits in a single line.

## Development commands

### 1. Start Relay Compiler
To start the Relay compiler, run the following command:
```bash
pnpm run relay
```

### 2. Run server
After following the setup guide, the server can be run independently locally using the following command:
```bash
pnpm run dev
```

## TODO (auth)

add accounts center
where:
 
- users can delete their accounts
- delete existing 2fa challenge before trying another sign in method
- option to disable password
- encrypt user session cookie using JWE
- rename TwoFactorAuthenticationNotEnabledError to AuthenticatorNotEnabledError wherever applicable (ex: verify_2fa_challenge_with_authenticator)

Github Uses SECURITY KEYS only as a form of 2fa, not PASSKEYS.
hence our current setup is correct
