"use client";

import Link from "next/link";
import Header from "@/components/Header";
import CustomButton from "@/components/CustomButton";

export default function DepositFailedPage() {
  return (
    <div className="max-w-md mx-auto py-2">
      <Header title="Deposit Failed" showBack={false} />
      <div className="bg-charcoal-light rounded-2xl p-8 text-center mt-4">
        <div className="w-16 h-16 rounded-full bg-red/20 text-red flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          ✕
        </div>
        <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
        <p className="text-gray text-sm mb-6">Something went wrong. Please try again.</p>
        <Link href="/deposit">
          <CustomButton title="Try Again" className="w-full rounded-lg" textClassName="text-white" />
        </Link>
      </div>
    </div>
  );
}
