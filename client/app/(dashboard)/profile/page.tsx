import ProfileView from "@/components/profile/ProfileView";

export const dynamic = "force-dynamic";

export default function Profile() {

  return (
    <div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col gap-8">
      <ProfileView />
    </div>
  );
}
