"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import displayCurrency from "@/lib/displayCurrency";
import { useAuthStore } from "@/store/AuthStore";

type GameHistory = {
  id?: string;
  game_type?: string;
  stake?: number;
  payout?: number;
  status?: string;
  created_at?: string;
  is_win?: boolean;
};

export default function GamesPlayedPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const [items, setItems] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoadingAuth, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const load = async (p: number, replace = false) => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/virtual/history", {
        params: { page: p, page_size: 20 },
      });
      const list = res.data?.results || res.data?.data || res.data?.history || [];
      setItems((prev) => (replace ? list : [...prev, ...list]));
      setPage(p);
      setHasMore(Boolean(res.data?.next) || list.length >= 20);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 max-w-2xl mx-auto">
      <Header title="Games Played" />
      <div className="mt-2 space-y-2">
        {loading && items.length === 0 ? (
          <Loading />
        ) : items.length === 0 ? (
          <p className="text-center text-gray py-10">No games played yet</p>
        ) : (
          items.map((g, i) => (
            <div key={g.id || i} className="bg-charcoal-light rounded-xl p-4 flex justify-between">
              <div>
                <p className="font-semibold capitalize">{g.game_type || "Game"}</p>
                <p className="text-xs text-gray mt-1">{g.created_at ? new Date(g.created_at).toLocaleString() : "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray">Stake {displayCurrency(Number(g.stake || 0))}</p>
                <p className={`font-bold ${g.is_win || g.status === "won" ? "text-green" : "text-white"}`}>
                  {displayCurrency(Number(g.payout || 0))}
                </p>
              </div>
            </div>
          ))
        )}
        {hasMore ? (
          <button type="button" onClick={() => void load(page + 1)} className="w-full py-3 rounded-xl bg-charcoal-light text-sm font-semibold" disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
