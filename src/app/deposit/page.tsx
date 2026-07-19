"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { data } from "@/constants";
import { axiosClient } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiErrorMessage";
import { useAuthStore } from "@/store/AuthStore";
import { useLoaderStore } from "@/store/loaderStore";

export default function DepositPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const { isLoading, setLoading } = useLoaderStore();
  const [means, setMeans] = useState("cash");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoadingAuth, router]);

  const handleContinue = async () => {
    if (isLoading) return;
    if (!amount || Number(amount) < 100) return toast("Amount should be at least 100 Naira");
    if (means !== "cash") return toast("Only cash (Nomba) deposits are available on web");

    try {
      setLoading(true);
      const result = await axiosClient.post("/wallet/fund", {
        amount: Number(amount),
        payment_method: "nomba",
      });
      const link = result.data.checkout_link;
      if (link) {
        sessionStorage.setItem("depositPaylink", link);
        router.push("/deposit/gateway");
      } else {
        toast.error("No payment link returned");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 max-w-lg mx-auto">
      <Header title="Deposit" />
      <div className="bg-charcoal-light rounded-2xl p-5 space-y-4 mt-2">
        <div>
          <p className="text-white text-sm mb-2">Deposit means</p>
          <div className="flex gap-2 flex-wrap">
            {data.depositMethod.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMeans(m.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  means === m.value ? "bg-red border-red text-white" : "border-gray text-gray"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <FormField title="Amount" value={amount} placeholder="Min 100" onChange={setAmount} type="number" />
        {means === "airtime" ? (
          <FormField title="Phone" value={phone} placeholder="Phone number" onChange={setPhone} type="tel" />
        ) : null}
        <CustomButton title="Continue" onClick={handleContinue} className="w-full rounded-lg" textClassName="text-white" />
      </div>
    </div>
  );
}
