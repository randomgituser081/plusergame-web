"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import CustomButton from "@/components/CustomButton";

export default function DepositGatewayPage() {
  const router = useRouter();
  const [paylink, setPaylink] = useState("");

  useEffect(() => {
    const link = sessionStorage.getItem("depositPaylink") || "";
    if (!link) router.replace("/deposit");
    else setPaylink(link);
  }, [router]);

  if (!paylink) return null;

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="Payment" />
      <div className="flex-1 px-4 pb-4 max-w-4xl mx-auto w-full">
        <iframe src={paylink} title="Payment Gateway" className="w-full h-[70vh] rounded-xl border border-white/10 bg-white" />
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <CustomButton
            title="Payment Successful"
            onClick={() => router.push("/deposit/success")}
            className="flex-1 rounded-lg"
            textClassName="text-white"
          />
          <CustomButton
            title="Payment Failed"
            onClick={() => router.push("/deposit/failed")}
            className="flex-1 rounded-lg"
            bgColor="bg-charcoal-light border border-yellow"
            textClassName="text-yellow"
          />
        </div>
      </div>
    </div>
  );
}
