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

type Txn = {
  id?: string;
  amount?: number;
  status?: string;
  type?: string;
  transaction_type?: string;
  created_at?: string;
  reference?: string;
};

export default function TransactionsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const [items, setItems] = useState<Txn[]>([]);
  const [search, setSearch] = useState("");
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
      const res = await axiosClient.get("/transactions/", {
        params: { page: p, page_size: 20, search: search || undefined },
      });
      const list = res.data?.results || res.data?.data || res.data?.transactions || [];
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
      <Header title="Transactions" />
      <div className="mt-2 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(1, true);
          }}
          className="flex gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="flex-1 h-11 rounded-xl bg-charcoal-light border border-white/10 px-4 text-sm outline-none focus:border-yellow"
          />
          <button type="submit" className="bg-red px-4 rounded-xl text-sm font-semibold">
            Search
          </button>
        </form>

        {loading && items.length === 0 ? (
          <Loading />
        ) : items.length === 0 ? (
          <p className="text-center text-gray py-10">No transactions found</p>
        ) : (
          <div className="space-y-2">
            {items.map((txn, i) => (
              <div key={txn.id || txn.reference || i} className="bg-charcoal-light rounded-xl p-4 flex justify-between gap-3">
                <div>
                  <p className="font-semibold capitalize">{txn.transaction_type || txn.type || "Transaction"}</p>
                  <p className="text-xs text-gray mt-1">{txn.created_at ? new Date(txn.created_at).toLocaleString() : "—"}</p>
                  <p className="text-xs text-gray">{txn.reference}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{displayCurrency(Number(txn.amount || 0))}</p>
                  <p className="text-xs capitalize text-yellow mt-1">{txn.status || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore ? (
          <button
            type="button"
            onClick={() => void load(page + 1)}
            className="w-full py-3 rounded-xl bg-charcoal-light text-sm font-semibold"
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
