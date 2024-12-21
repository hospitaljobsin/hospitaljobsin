"use client";
import { AuthContext } from "@/components/AuthProvider";
import { use } from "react";

// Create a custom hook for consuming the context
export const useAuth = () => {
	const context = use(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
