import CustomFeedServer from "@/components/ui/user/CustomFeedServer";
import { ProfileHeader } from "@/components/ui/user/ProfileHeader";
import { UserProfileSidebar } from "@/components/ui/user/UserProfileSidebar";
import { getUserProfileById } from "@/server/services/user/loader";
import { getUsersByName } from "@/server/services/user/repo";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const user = (await getUsersByName([username]))[0];
  if (!user) return notFound();
  let output =(await getUserProfileById(user.id))!
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <ProfileHeader user={user} />
          <CustomFeedServer username={user.username}/>
        </div>
        <aside className="hidden lg:block shrink-0">
          <UserProfileSidebar user={output}  />
        </aside>
      </div>
    </div>
  );
}
