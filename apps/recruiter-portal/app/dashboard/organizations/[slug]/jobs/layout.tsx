
import JobDetailHeaderClientComponent from "./JobDetailHeaderClientComponent";

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<>
			<JobDetailHeaderClientComponent />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
