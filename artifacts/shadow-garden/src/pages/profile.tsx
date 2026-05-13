import { useState } from "react";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { useGetProfile, useListCards, useUpdateProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Edit2, Save, X } from "lucide-react";

const rarityConfig: Record<string, { badge: string; label: string }> = {
  god:       { badge: "bg-gradient-to-r from-red-600 to-yellow-400", label: "God" },
  legendary: { badge: "bg-gradient-to-r from-orange-500 to-yellow-400", label: "Legendary" },
  epic:      { badge: "bg-gradient-to-r from-red-500 to-rose-400", label: "Epic" },
  rare:      { badge: "bg-gradient-to-r from-red-800 to-red-500", label: "Rare" },
  uncommon:  { badge: "bg-gradient-to-r from-red-950 to-red-700", label: "Uncommon" },
  common:    { badge: "bg-gradient-to-r from-gray-600 to-gray-500", label: "Common" },
};

type Tab = "overview" | "deck";

export default function Profile() {
  const { user: me } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ display_name: "", bio: "", title: "" });
  const queryClient = useQueryClient();
  const updateMutation = useUpdateProfile();

  const userId = me?.id;

  const { data: profile, isLoading } = useGetProfile(
    userId ? { userId } : undefined,
    { query: { enabled: !!userId, queryKey: getGetProfileQueryKey(userId ? { userId } : undefined) } }
  );

  const deckParams = userId ? { userId, limit: 24, page: 1 } : undefined;
  const { data: deckData } = useListCards(
    deckParams,
    { query: { queryKey: ["cards", deckParams], enabled: tab === "deck" && !!userId } as any }
  );

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ParticleBackground />
        <Navbar />
        <div className="relative z-10 text-center">
          <p className="text-white/55 mb-4">Sign in to view your profile</p>
          <Link href="/login">
            <button className="btn-primary px-6 py-3 rounded-full text-white font-semibold">Sign In</button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ParticleBackground />
        <Navbar />
        <div className="relative z-10 w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const startEdit = () => {
    setEditData({
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
      title: profile?.title || "",
    });
    setEditMode(true);
  };

  const saveEdit = () => {
    updateMutation.mutate(
      { data: editData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey({ userId }) });
          setEditMode(false);
        },
      }
    );
  };

  const stats = [
    { label: "Wallet",    value: `${(profile?.wallet ?? 0).toLocaleString()} slimes`, icon: "💰" },
    { label: "XP",        value: (profile?.xp ?? 0).toLocaleString(),                 icon: "⭐" },
    { label: "Cards",     value: profile?.card_count ?? 0,                            icon: "🃏" },
    { label: "Pokémon",  value: profile?.pokemon_count ?? 0,                          icon: "⚡" },
    { label: "Level",     value: profile?.level ?? 1,                                 icon: "🔮" },
    { label: "Bank",      value: `${(profile?.bank ?? 0).toLocaleString()}`,          icon: "🏦" },
  ];

  const achievements = profile?.achievements || [];

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Banner + Avatar */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06] mb-6">
          <div className="h-36 bg-gradient-to-r from-red-950 via-red-900 to-black relative">
            {profile?.cover_url && (
              <img src={profile.cover_url} alt="" className="w-full h-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          </div>

          <div className="px-6 pb-6 -mt-10 relative">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-red-800/50 overflow-hidden bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    : (profile?.display_name || me?.display_name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="pb-1">
                  {editMode ? (
                    <input
                      value={editData.display_name}
                      onChange={(e) => setEditData((d) => ({ ...d, display_name: e.target.value }))}
                      className="bg-white/[0.06] border border-white/[0.10] rounded-lg px-3 py-1 text-white font-bold text-xl focus:outline-none focus:border-red-700/50"
                    />
                  ) : (
                    <h1 className="text-2xl font-black text-white">{profile?.display_name || me?.display_name}</h1>
                  )}
                  {editMode ? (
                    <input
                      value={editData.title}
                      onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
                      placeholder="Your title..."
                      className="mt-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1 text-sm text-red-400 focus:outline-none focus:border-red-700/50 w-full"
                    />
                  ) : (
                    profile?.title && <p className="text-red-400 text-sm mt-0.5">{profile.title}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button onClick={saveEdit} disabled={updateMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 btn-primary rounded-xl text-white text-sm font-semibold">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={() => setEditMode(false)}
                      className="flex items-center gap-1.5 px-4 py-2 glass-card rounded-xl text-white/55 text-sm hover:text-white border border-white/[0.06]">
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={startEdit}
                    className="flex items-center gap-1.5 px-4 py-2 glass-card rounded-xl text-white/55 text-sm hover:text-red-400 transition-colors border border-white/[0.06]">
                    <Edit2 size={14} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {editMode ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData((d) => ({ ...d, bio: e.target.value }))}
                placeholder="Write your bio..."
                rows={2}
                className="mt-4 w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-red-700/50 resize-none"
              />
            ) : (
              profile?.bio && <p className="mt-4 text-white/50 text-sm leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-4 text-center border border-white/[0.05]">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-white/30 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["overview", "deck"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t ? "btn-primary text-white" : "glass-card text-white/45 hover:text-white border border-white/[0.06]"
              }`}>
              {t === "overview" ? "Overview" : "Card Deck"}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-4">
            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">🏅 Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((ach: string, i: number) => (
                    <span key={i} className="glass-card px-3 py-1 rounded-full text-sm text-red-400 border border-red-900/30">
                      {ach}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
              <h3 className="text-white font-bold mb-2">📊 Activity</h3>
              <p className="text-white/35 text-sm">Joined Shadow Garden and is collecting cards and Pokémon.</p>
            </div>
          </div>
        )}

        {tab === "deck" && (
          <div>
            {deckData && deckData.cards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {deckData.cards.map((card) => {
                  const cfg = rarityConfig[card.rarity] || rarityConfig.common;
                  return (
                    <div key={card.id} className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all border border-white/[0.05] hover:border-red-800/30">
                      <div className="relative aspect-[3/4]">
                        <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://i.imgur.com/oiGxZm9.png"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className={`absolute top-2 right-2 ${cfg.badge} rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white`}>
                          {cfg.label}
                        </div>
                        <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold truncate">{card.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center glass-card rounded-2xl border border-white/[0.06]">
                <p className="text-4xl mb-3">🃏</p>
                <p className="text-white/35">No cards in your deck yet</p>
                <p className="text-white/20 text-sm mt-1">Use the bot to collect cards</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
