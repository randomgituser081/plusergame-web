"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import BalanceCard from "@/components/BalanceCard";
import { data } from "@/constants";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import { useLoaderStore } from "@/store/loaderStore";
import getWallet from "@/lib/WalletApi";

type Bank = { code: string; name: string; logo?: string };

export default function WithdrawPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const { isLoading, setLoading } = useLoaderStore();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showBanks, setShowBanks] = useState(false);
  const [isGettingName, setIsGettingName] = useState(false);
  const [form, setForm] = useState({
    means: "cash",
    amount: "",
    account_number: "",
    bank_name: "",
    bank_code: "",
    phone: "",
    account_name: "",
  });

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
    else if (isAuthenticated) void getWallet(true);
  }, [isAuthenticated, isLoadingAuth, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    axiosClient
      .get("/withdrawal/list-banks")
      .then((res) => setBanks(res.data?.banks || res.data || []))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (form.account_number.length === 10 && form.bank_code) {
      void resolveName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.account_number, form.bank_code]);

  const resolveName = async () => {
    setIsGettingName(true);
    try {
      const result = await axiosClient.post("/withdrawal/account-details", {
        account_number: form.account_number,
        bank_code: form.bank_code,
      });
      const name = result.data?.accountName || "";
      setForm((prev) => ({ ...prev, account_name: name }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not fetch account name"));
      setForm((prev) => ({ ...prev, account_name: "" }));
    } finally {
      setIsGettingName(false);
    }
  };

  const withdraw = async () => {
    if (isLoading) return;
    if (!form.amount || Number(form.amount) < 100) return toast("Amount should be at least 100 Naira");
    if (form.means === "cash") {
      if (!form.bank_code || form.account_number.length < 10 || !form.account_name) {
        return toast("Complete bank details first");
      }
    }

    setLoading(true);
    try {
      const payload =
        form.means === "cash"
          ? {
              account_name: form.account_name,
              account_number: form.account_number,
              amount: Number(form.amount),
              bank_code: form.bank_code,
              currency: "NGN",
            }
          : {
              means: form.means,
              phone: form.phone,
              amount: Number(form.amount),
              currency: "NGN",
            };

      const result = await axiosClient.post("/withdrawal/initiate", payload);
      sessionStorage.setItem("withdrawReceipt", JSON.stringify(result.data));
      router.push("/withdraw/success");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 max-w-lg mx-auto">
      <Header title="Withdraw" />
      <div className="mt-2 space-y-4">
        <BalanceCard />
        <div className="bg-charcoal-light rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-white text-sm mb-2">Withdrawal means</p>
            <div className="flex gap-2 flex-wrap">
              {data.withdrawMethod.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm({ ...form, means: m.value })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                    form.means === m.value ? "bg-red border-red text-white" : "border-gray text-gray"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <FormField title="Amount" value={form.amount} placeholder="Min 100" onChange={(e) => setForm({ ...form, amount: e })} type="number" />
          {form.means === "cash" ? (
            <>
              <button
                type="button"
                onClick={() => setShowBanks(true)}
                className="w-full h-[46px] rounded-lg bg-gray text-left px-4 text-charcoal font-medium"
              >
                {form.bank_name || "Select bank"}
              </button>
              <FormField
                title="Account Number"
                value={form.account_number}
                placeholder="10 digits"
                onChange={(e) => setForm({ ...form, account_number: e.replace(/\D/g, "").slice(0, 10) })}
                type="tel"
              />
              <p className="text-sm text-yellow">{isGettingName ? "Resolving…" : form.account_name || "—"}</p>
            </>
          ) : (
            <FormField title="Phone" value={form.phone} placeholder="Phone number" onChange={(e) => setForm({ ...form, phone: e })} type="tel" />
          )}
          <CustomButton title="Withdraw" onClick={withdraw} className="w-full rounded-lg" textClassName="text-white" />
        </div>
      </div>

      {showBanks ? (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={() => setShowBanks(false)}>
          <div className="bg-charcoal-light w-full max-w-md max-h-[70vh] rounded-t-2xl sm:rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 font-semibold">Select Bank</div>
            <div className="overflow-y-auto max-h-[60vh]">
              {banks.map((bank) => (
                <button
                  key={bank.code}
                  type="button"
                  className="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-charcoal"
                  onClick={() => {
                    setForm({ ...form, bank_name: bank.name, bank_code: bank.code, account_number: "", account_name: "" });
                    setShowBanks(false);
                  }}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
