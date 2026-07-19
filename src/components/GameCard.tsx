"use client";

import Link from "next/link";
import CustomButton from "./CustomButton";
import clsx from "clsx";

type GameItem = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

export default function GameCard({ item, index }: { item: GameItem; index: number }) {
  const isOdd = index % 2 !== 0;
  const gradient = isOdd
    ? "bg-gradient-to-r from-yellow to-[#8B1A1A]"
    : "bg-gradient-to-r from-[#8B1A1A] to-yellow";

  return (
    <div className={clsx("rounded-[14px] p-[1px] mb-3", gradient)}>
      <div className="bg-charcoal rounded-[13px] gap-2 flex flex-row overflow-hidden min-h-[130px] max-h-[160px]">
        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="text-white text-lg font-semibold mb-1">{item.title}</h3>
          <p className="text-gray text-sm font-medium leading-[18px] mb-3">{item.description}</p>
          <Link href={`/games/${item.slug}`}>
            <CustomButton
              title="Play Now"
              className="self-start py-2.5 px-4 rounded-lg min-h-0"
              textClassName="text-white text-sm"
            />
          </Link>
        </div>
        <div className="w-[40%] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}
