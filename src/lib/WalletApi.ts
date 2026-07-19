import { axiosClient } from "@/lib/api";
import useWalletStore from "@/store/WalletStore";
import toast from "react-hot-toast";

export default async function getWallet(runOnBackground: boolean) {
  const { setWalletInfo, setBalanceLoading } = useWalletStore.getState();

  if (!runOnBackground) setBalanceLoading(true);

  try {
    const result = await axiosClient.get("/wallet/");
    const payload = result.data;
    setWalletInfo({
      total: payload?.balance ?? 0,
      bonus: Number(payload?.bonus_balance ?? 0),
      playing: Number(payload?.playing_balance ?? 0),
      winning: Number(payload?.winning_balance ?? 0),
    });
  } catch (error: unknown) {
    // Avoid noisy toasts on background refresh / React Strict Mode double-mount
    if (!runOnBackground) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to fetch wallet balance");
    }
  } finally {
    if (!runOnBackground) setBalanceLoading(false);
  }
}
