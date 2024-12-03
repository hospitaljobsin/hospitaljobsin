export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center h-full">
      <div className="mx-auto w-full max-w-md h-full">{children}</div>
    </main>
  );
}
