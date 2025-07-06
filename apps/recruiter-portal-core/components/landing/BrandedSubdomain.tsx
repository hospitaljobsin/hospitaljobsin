"use client";
import type { BrandedSubdomainCheckMutation } from "@/__generated__/BrandedSubdomainCheckMutation.graphql";
import { env } from "@/lib/env/client";
import { useDebounce } from "@/lib/hooks/useDebounce";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";

// Animation variants for staggered list
const listVariants: Variants = {
	visible: {
		transition: {
			staggerChildren: 0.25,
		},
	},
	hidden: {},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: [0.23, 1, 0.32, 1], // easeOut cubic-bezier
			delay: i * 0.08,
		},
	}),
};

const CheckAvailabilityMutation = graphql`
	mutation BrandedSubdomainCheckMutation($slug: String!) {
		checkOrganizationSlugAvailability(slug: $slug) {
			isAvailable
		}
	}
`;

const formSchema = z.object({
	slug: z
		.string()
		.min(1, "This field is required")
		.max(75)
		.regex(/^[a-z0-9-]+$/, "Must be a valid slug")
		.refine((value) => value === value.toLowerCase(), "Must be lowercase"),
});

export default function BrandedSubdomain() {
	const router = useRouter();
	const [commitMutation, isMutationInFlight] =
		useMutation<BrandedSubdomainCheckMutation>(CheckAvailabilityMutation);

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors, isValid },
		watch,
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			slug: "",
		},
	});

	const slug = watch("slug");
	const debouncedSlug = useDebounce(slug, 500);

	useEffect(() => {
		// Check if current debouncedSlug passes Zod validation
		const parsed = formSchema.safeParse({ slug: debouncedSlug });
		if (!debouncedSlug || !parsed.success) return;

		commitMutation({
			variables: { slug: debouncedSlug },
			onCompleted: (data) => {
				if (data?.checkOrganizationSlugAvailability?.isAvailable) {
					clearErrors("slug");
				} else {
					setError("slug", {
						message: "Subdomain is not available",
						type: "manual",
					});
				}
			},
			onError: () => {
				setError("slug", {
					message: "Subdomain is not available",
					type: "manual",
				});
			},
		});
	}, [debouncedSlug, commitMutation, clearErrors, setError]);

	async function onSubmit(data: z.infer<typeof formSchema>) {
		router.push(links.createOrganization(data.slug));
	}

	return (
		<motion.section
			className="px-4 w-full py-16 rounded-2xl relative"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
		>
			<div className="max-w-7xl mx-auto flex flex-col items-center gap-10 relative z-10 px-2 sm:px-6">
				<div className="flex flex-col items-center gap-2 w-full">
					<h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-primary-700 text-center relative inline-block">
						<span className="relative z-10">Your Own Branded Subdomain</span>
					</h2>
					<h3 className="text-lg sm:text-xl text-foreground-700 dark:text-foreground-200 text-center">
						A professional home for your organization
					</h3>
				</div>
				{/* Unique Subdomain */}
				<motion.div
					className="w-full group flex flex-col items-center gap-4 rounded-2xl p-8"
					variants={itemVariants}
					custom={0}
					tabIndex={0}
					aria-label="Unique Subdomain feature"
				>
					<form
						className="flex-shrink-0 mb-2 w-full flex flex-col sm:flex-row items-start gap-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Input
							{...register("slug")}
							placeholder="yourdomain"
							size="lg"
							fullWidth
							value={slug}
							startContent={
								<SearchIcon size={24} className="text-foreground-500 mr-2" />
							}
							endContent={
								<span className="text-base sm:text-xl">
									.{env.NEXT_PUBLIC_ROOT_DOMAIN}
								</span>
							}
							classNames={{
								inputWrapper: `p-4 md:p-12 min-h-12 sm:min-h-24 ${
									isValid ? "border border-2 border-success" : ""
								}`,
								input: "text-base sm:text-xl",
							}}
							isInvalid={!!errors.slug}
							errorMessage={errors.slug?.message}
						/>
						<Button
							type="submit"
							size="lg"
							className="h-full min-h-12 sm:min-h-24 sm:px-12 px-4 text-base sm:text-xl w-full sm:w-auto"
							color="primary"
							isDisabled={!isValid || isMutationInFlight}
						>
							Claim Domain
						</Button>
					</form>
					<div className="text-foreground-600 text-base text-center max-w-xl">
						Instantly claim a memorable web address for your hospital or clinic—
						<span className="font-medium">
							yourdomain.{env.NEXT_PUBLIC_ROOT_DOMAIN}
						</span>
					</div>
				</motion.div>
				<motion.div
					className="flex flex-col sm:flex-row gap-8 w-full mt-4 justify-center items-center flex-1"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={listVariants}
				>
					{/* Customizable Profile */}
					<motion.div
						className="max-w-md group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
						variants={itemVariants}
						custom={1}
						tabIndex={0}
						aria-label="Customizable Profile feature"
					>
						<div className="flex-shrink-0 mb-2 relative w-48 h-48">
							<Image
								src="/images/online-profile.svg"
								alt="Customizable Profile"
								fill
								className="object-cover  group-hover:scale-110 transition-transform duration-200"
							/>
						</div>
						<div className="font-medium text-primary-700 text-xl text-center">
							Customizable Profile
						</div>
						<div className="text-foreground-600 text-base text-center">
							Showcase your unique culture, values, and benefits with a
							beautiful, fully customizable organization profile.
						</div>
					</motion.div>
					{/* Unlimited Team Members */}
					<motion.div
						className="max-w-md group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
						variants={itemVariants}
						custom={2}
						tabIndex={0}
						aria-label="Unlimited Team Members feature"
					>
						<div className="flex-shrink-0 mb-2 relative w-48 h-48">
							<Image
								src="/images/team.svg"
								alt="Customizable Profile"
								fill
								className="object-cover  group-hover:scale-110 transition-transform duration-200"
							/>
						</div>
						<div className="font-medium text-primary-700 text-xl text-center">
							Unlimited Team Members
						</div>
						<div className="text-foreground-600 text-base text-center">
							Collaborate effortlessly—invite your entire hiring team, from HR
							to department heads, with no limits.
						</div>
					</motion.div>
					{/* Access Control */}
					<motion.div
						className="max-w-md group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
						variants={itemVariants}
						custom={3}
						tabIndex={0}
						aria-label="Granular Access Control feature"
					>
						<div className="flex-shrink-0 mb-2 relative w-48 h-48">
							<Image
								src="/images/secure-access.svg"
								alt="Customizable Profile"
								fill
								className="object-cover group-hover:scale-110 transition-transform duration-200"
							/>
						</div>
						<div className="font-medium text-primary-700 text-xl text-center">
							Granular Access Control
						</div>
						<div className="text-foreground-600 text-base text-center">
							Assign roles, promote admins, and manage recruiter permissions
							with a click—security and flexibility for every team.
						</div>
					</motion.div>
				</motion.div>
			</div>
		</motion.section>
	);
}
