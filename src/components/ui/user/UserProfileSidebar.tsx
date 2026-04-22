import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfileDto } from "@/types/user";
import { MessageCircle, MoreHorizontal, Plus } from "lucide-react";
import ProfileBanner from "./ProfileBanner";

interface Trophy {
  id: string;
  label: string;
  description?: string;
  iconUrl?: string;
}

interface UserProfileSidebarProps {
  user:  UserProfileDto
}


export function UserProfileSidebar(props: UserProfileSidebarProps) {
  return (
    <div className="w-[312px] rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <ProfileBanner bannerUrl={props.user.banner}/>
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mt-3 mb-3">
          <span className="font-semibold text-base text-foreground">{props.user.name}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Button size="sm" className="flex-1 rounded-full gap-1.5 font-semibold text-sm h-9"  disabled>
            <Plus className="w-4 h-4" />
            Follow
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-full gap-1.5 font-semibold text-sm h-9"  disabled>
            <MessageCircle className="w-4 h-4" />
            Start Chat
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-y-3 mb-4">
          <StatCell label="Karma" value={"PHH"} />
          <StatCell label="Contributions" value={"PHH"} />
          <StatCell label="Reddit Age" value={`PHH`} />
          <StatCell label="Active in >" value={"PHH"} />
        </div>

        <Separator className="my-3" />

        {/* <TrophyCase trophies={trophies} /> */}
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function TrophyCase({ trophies }: { trophies: Trophy[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Trophy Case</p>
      <ul className="space-y-2.5">
        {trophies.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">{t.iconUrl ? <img src={t.iconUrl} alt={t.label} className="w-6 h-6 object-contain" /> : <span className="text-sm">🏆</span>}</div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-foreground leading-tight">{t.label}</span>
              {t.description && <span className="text-xs text-muted-foreground truncate">{t.description}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
