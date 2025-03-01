import Header from "@/components/settings/Header";

export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
