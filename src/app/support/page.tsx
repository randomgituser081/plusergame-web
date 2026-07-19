"use client";

import Header from "@/components/Header";
import { images } from "@/constants";
import { Mail, Phone } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="py-2 max-w-lg mx-auto">
      <Header title="Support" />
      <div className="bg-charcoal-light rounded-2xl p-6 mt-2 space-y-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.faq} alt="" className="w-24 h-24 mx-auto object-contain" />
        <p className="text-center text-gray text-sm">
          Need help with deposits, withdrawals or games? Reach our support team.
        </p>
        <a href="mailto:support@plusergame.com" className="flex items-center gap-3 bg-charcoal rounded-xl p-4">
          <Mail className="text-yellow" size={20} />
          <div>
            <p className="text-xs text-gray">Email</p>
            <p className="font-semibold">support@plusergame.com</p>
          </div>
        </a>
        <a href="tel:+2348000000000" className="flex items-center gap-3 bg-charcoal rounded-xl p-4">
          <Phone className="text-yellow" size={20} />
          <div>
            <p className="text-xs text-gray">Phone</p>
            <p className="font-semibold">+234 800 000 0000</p>
          </div>
        </a>
      </div>
    </div>
  );
}
