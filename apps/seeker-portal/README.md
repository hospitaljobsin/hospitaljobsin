# Hospital Jobs
> *Job Seeker Platform UI for Hospital Jobs*

## Tech Stack
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [React.js](https://react.dev) - UI library
- [Next.js](https://nextjs.org) - React metaframework
- [HeroUI](https://heroui.com/) - Component library
- [React Hook Form](https://react-hook-form.com/) - Form library
- [Zod](https://zod.dev/) - Schema validation library
- [Relay](https://relay.dev/) - GraphQL client
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
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