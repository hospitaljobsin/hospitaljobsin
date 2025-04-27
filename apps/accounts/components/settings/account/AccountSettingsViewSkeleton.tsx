"use client";
import AccountDetailsSkeleton from "./AccountDetailsSkeleton";
import PasswordSkeleton from "./PasswordSkeleton";
import TwoFactorAuthenticationSkeleton from "./TwoFactorAuthenticationSkeleton";

export default function AccountSettingsViewSkeleton() {
	return (
		<div className="w-full h-full space-y-16">
			<AccountDetailsSkeleton />

			<PasswordSkeleton />

			<TwoFactorAuthenticationSkeleton />
		</div>
	);
}
