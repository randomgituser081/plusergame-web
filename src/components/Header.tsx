"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
};

export default function Header({ title, onBack, showBack = true }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-30 bg-charcoal/90 backdrop-blur-sm">
      {showBack ? (
        <button
          type="button"
          onClick={() => (onBack ? onBack() : router.back())}
          className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-white"
        >
          <ArrowLeft size={20} />
        </button>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="text-white font-semibold text-lg flex-1 text-center pr-10">{title}</h1>
    </div>
  );
}
