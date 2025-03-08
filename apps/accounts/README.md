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
- show not founds on the 2fa pages if the challenge doesn't exist already (like GitHub does)
- delete existing 2fa challenge before trying another sign in method
- option to disable password

Github Uses SECURITY KEYS only as a form of 2fa, not PASSKEYS.
hence our current setup is correct


SOLUTION:

You can solve this by embedding the 2fa challenge state into a value you can check in your middleware. One common pattern is to add an extra flag or claim into your user_session JWT (or even set a separate cookie) when the 2fa challenge is created. Then your middleware can decode the token and enforce these rules:

When a user logs in with 2fa enabled:
– Your backend creates a 2fa challenge and updates the JWT (or sets a separate cookie) with a flag (e.g. twoFactorPending: true).

In your middleware:
– Decode/verify the JWT on every request.
– If the user has twoFactorPending set to true and they are not on the 2fa page, redirect them to /2fa.
– Conversely, if a request is made to /2fa but the flag isn’t present (or the challenge has already been resolved), then redirect the user to the appropriate authenticated page.

After 2fa verification is complete:
– Update the token so that the twoFactorPending flag is removed (or simply delete the 2fa cookie) so that subsequent middleware checks allow the user to navigate normally.

This approach keeps all session state in one place (or at least in a consistent, signed token) and lets your middleware enforce access to the 2fa page as well as the rest of your authenticated pages.

Yes, that's a common approach. The Next.js server (or middleware running on the Edge) can decode and verify a JWT as long as it has access to the signing key. You can embed both the authenticated state and additional flags (like a twoFactorPending flag) in the same user_session JWT.

Key points:

JWT Decoding:
Your Next.js middleware can decode the JWT to inspect its claims. Just ensure you're using a lightweight library or method compatible with your runtime (especially if using Edge Middleware).

Combining Session State:
Merging your authenticated state and 2FA challenge flag in a single token simplifies state management. Just be sure the token is properly signed and secure (using HTTP-only cookies, for example).

Security Considerations:
Make sure the JWT payload doesn't expose sensitive information. Also, if you’re combining multiple concerns in one token, consider the token's size and ensure that any changes to the state (e.g., after successful 2FA) are properly updated by issuing a new token.

By doing this, you can conditionally redirect users based on their token state (for instance, redirecting to the 2FA page if twoFactorPending is true) and then clear that flag after the challenge is completed.

This approach keeps the state centralized and leverages the built-in capabilities of JWTs for secure, stateless session management.