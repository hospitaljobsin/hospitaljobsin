import Footer from '@/components/layout/Footer';

export default function BaseLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
