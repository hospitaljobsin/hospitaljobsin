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
- when user is stuck while verifying their 2FA code, allow them to use their passkey, like Github (for better UX)
  (GITHUB SUPPORTS sms, passkeys and authenticator apps as valid 2FA methods)
- allow usage of passkeys for resetting passwords (the button is shown conditionally)
- add modal before deleting passkeys, sessions, and delete all sessions
- add passkey as a second factor option
- option to disable password
- If the user loses access to their 2FA device, provide secure fallback options:
    Alternative 2FA Methods: Allow authentication via email or backup phone number.
    Manual Verification via Support: If no 2FA method is available, require identity verification (e.g., ID document upload or security questions).

TODO:
completely change 2FA

2FA shouldnt be enabled via authenticator app alone
2FA can be enabled via passkeys also
has_2fa_enabled should be a boolean field on the document
- last passkey cannot be deleted if 2fa is enabled with it
- authenticator app can be configured and disabled separately, but cannot be disabled if 2fa is enabled with only it