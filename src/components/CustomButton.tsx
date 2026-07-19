"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";

type ButtonProps = {
  title: string;
  onClick?: () => void;
  className?: string;
  bgColor?: string;
  textClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: "button" | "submit";
};

export default function CustomButton({
  title,
  onClick,
  className,
  bgColor,
  textClassName,
  isLoading,
  disabled,
  icon,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={clsx(
        bgColor || "bg-red",
        "rounded-full min-h-[48px] justify-center items-center flex px-6 transition-opacity",
        (isLoading || disabled) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-white animate-spin" />
      ) : (
        <span className="flex items-center gap-2">
          <span className={clsx("font-semibold text-base", textClassName)}>{title}</span>
          {icon}
        </span>
      )}
    </button>
  );
}
