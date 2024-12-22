import { createJiti } from "jiti";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti.esmResolve("./lib/env");

const nextConfig: NextConfig = {
	/* config options here */
	compiler: {
		relay: {
			src: "./",
			language: "typescript",
			eagerEsModules: true,
		},
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
