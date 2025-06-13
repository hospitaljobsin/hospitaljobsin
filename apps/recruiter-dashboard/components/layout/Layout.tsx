import type { FC, ReactNode } from "react";

// Try to import Sidebar, fallback to placeholder if not found
let Sidebar: React.ComponentType = () => <aside>Sidebar</aside>;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	Sidebar = require("./Sidebar").default || Sidebar;
} catch (e) {
	// fallback to placeholder
}

interface LayoutProps {
	children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<div className="flex-col md:flex-row flex gap-4">
			<div className="hidden md:block w-64 flex-shrink-0 p-4">
				<Sidebar />
			</div>
			<main className="w-full md:flex-1 md:min-w-0 p-4">
				{children || <div>Main Content</div>}
			</main>
		</div>
	);
};

export default Layout;
