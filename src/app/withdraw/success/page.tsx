"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import CustomButton from "@/components/CustomButton";
import displayCurrency from "@/lib/displayCurrency";

export default function WithdrawSuccessPage() {
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("withdrawReceipt");
    if (raw) {
      try {
        setInfo(JSON.parse(raw));
      } catch {}
    }
  }, []);

  return (
    <div className="max-w-md mx-auto py-2">
      <Header title="Withdrawal Receipt" showBack={false} />
      <div className="bg-charcoal-light rounded-2xl p-6 mt-4 space-y-3">
        <div className="w-16 h-16 rounded-full bg-green/20 text-green flex items-center justify-center text-3xl font-bold mx-auto mb-2">
          ✓
        </div>
        <h2 className="text-xl font-bold text-center">Withdrawal Initiated</h2>
        {info ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray">Amount</span><span>{displayCurrency(Number(info.amount || 0))}</span></div>
            <div className="flex justify-between"><span className="text-gray">Status</span><span className="capitalize">{String(info.status || "pending")}</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray">Reference</span><span className="text-right break-all">{String(info.reference || info.transaction_reference || "—")}</span></div>
          </div>
        ) : null}
        <Link href="/">
          <CustomButton title="Back to Home" className="w-full rounded-lg mt-4" textClassName="text-white" />
        </Link>
      </div>
    </div>
  );
}
