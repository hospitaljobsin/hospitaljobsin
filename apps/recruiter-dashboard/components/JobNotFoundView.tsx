import links from "@/lib/links";
import { Button } from "@heroui/react";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function JobNotFoundView() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full py-12 px-4 text-center gap-6">
			<div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-2">
				<SearchX className="w-10 h-10 text-red-500 dark:text-red-400" />
			</div>
			<h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
				404 Job Not Found
			</h1>
			<p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
				Sorry, we couldn't find the job you're looking for. It may have been
				removed or you may not be authorized.
			</p>
			<Link href={links.dashboard} passHref>
				<Button variant="solid" className="mt-4">
					Back to Dashboard
				</Button>
			</Link>
		</div>
	);
}
