import SavedView from "@/components/saved/SavedView";

export const dynamic = "force-dynamic";

export default function Saved() {
  return (
    <div className="py-8 w-full h-full max-w-5xl mx-auto flex flex-col gap-8">
      <SavedView />
    </div>
  );
}
