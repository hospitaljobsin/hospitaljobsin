import type { NextConfig } from "next";

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
