export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return <div className='w-full h-full bg-background-600'>{children}</div>;
}
