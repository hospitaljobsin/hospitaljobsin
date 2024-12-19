import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center gap-2">
      We couldn&apos;t find that job!
      <Link href="/">back to home</Link>
    </div>
  );
}
