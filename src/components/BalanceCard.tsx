"use client";

import Link from "next/link";
import { useState } from "react";
import { Grid3X3, Download, ArrowUpFromLine, Loader2 } from "lucide-react";
import displayCurrency from "@/lib/displayCurrency";
import useWalletStore from "@/store/WalletStore";
import { images } from "@/constants";

export default function BalanceCard() {
  const { wallet, balanceLoading, hideWallet } = useWalletStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-2xl p-[1px] mb-2 bg-gradient-to-r from-yellow to-[#8B1A1A]">
        <div className="w-full rounded-2xl p-4 overflow-hidden flex flex-row items-center bg-charcoal relative min-h-[140px]">
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow text-sm font-semibold tracking-widest">WALLET</span>
              <button type="button" onClick={() => setShowModal(true)} className="text-yellow">
                <Grid3X3 size={12} />
              </button>
            </div>
            <p className="text-gray text-xs">Balance</p>
            {balanceLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin mt-1" />
            ) : (
              <p className="text-white text-xl font-bold max-w-[70%]">
                {hideWallet === "true" ? "*****" : displayCurrency(Number(wallet?.total))}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Link
                href="/deposit"
                className="bg-red flex-1 px-2 py-2 rounded-full border border-red text-white text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Download size={13} /> DEPOSIT
              </Link>
              <Link
                href="/withdraw"
                className="bg-charcoal-light flex-1 px-2 py-2 rounded-full border border-yellow text-yellow text-xs font-semibold flex items-center justify-center gap-1"
              >
                <ArrowUpFromLine size={11} /> WITHDRAW
              </Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images.wallet}
            alt=""
            className="absolute bottom-3 right-4 w-24 h-24 object-contain opacity-95 pointer-events-none"
          />
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div
            className="rounded-2xl px-4 w-full max-w-md bg-charcoal-light"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="my-7 space-y-5">
              {[
                ["MAIN BALANCE", wallet.total],
                ["BONUS BALANCE", wallet.bonus],
                ["PLAYING BALANCE", wallet.playing],
                ["WINNING BALANCE", wallet.winning],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-medium text-sm text-white">{label}</p>
                  <p className="font-semibold text-xl text-white">{displayCurrency(Number(value))}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
