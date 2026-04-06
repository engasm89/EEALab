import { requireMomentumUser } from "@/lib/momentum/session";
import { hasActiveMomentumPro } from "@/lib/momentum/access";
import { MomentumCommunityPanel } from "@/components/momentum/MomentumCommunityPanel";

export default async function MomentumCommunityPage() {
  const user = await requireMomentumUser();
  const canPost = hasActiveMomentumPro(user);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Peer support and project discussion. Posting requires Pro; reading is open when signed in.
        </p>
      </div>
      <MomentumCommunityPanel canPost={canPost} />
    </div>
  );
}
