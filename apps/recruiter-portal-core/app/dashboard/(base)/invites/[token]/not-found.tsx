export default function InviteNotFound() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-4 py-12">
			<h1 className="text-3xl font-bold">Invite Not Found</h1>
			<p className="text-lg text-gray-500 text-center">
				This invite link is invalid or has expired. Please verify the link or
				contact the sender.
			</p>
		</div>
	);
}
