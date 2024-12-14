
export const dynamic = "force-dynamic";

export default function Profile() {

  return (
    <div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col gap-8">
      <h1 className="text-5xl text-center w-full max-w-4xl text-balance mx-auto py-12">
        My Profile
      </h1>
      {/* <Suspense fallback={<LandingViewSkeleton />}>
        <LandingView />
      </Suspense> */}
    </div>
  );
}
