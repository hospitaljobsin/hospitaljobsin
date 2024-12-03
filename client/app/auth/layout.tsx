export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex h-full items-center justify-center">
      <div className="mx-auto w-full flex-1 px-6">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
      <div className="h-full bg-primary-100 flex-1 hidden lg:block"></div>
    </div>
  );
}
