import { getProfile } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/ui";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfile();
  return (
    <div>
      <PageHeader title="Profile & Public Site" subtitle="Control everything visitors see on your homepage." />
      <ProfileEditor initial={profile} />
    </div>
  );
}
