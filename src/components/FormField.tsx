"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

type FormFieldProps = {
  title?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  labelClassName?: string;
  inputBg?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
  secure?: boolean;
};

export default function FormField({
  title,
  value,
  placeholder,
  onChange,
  labelClassName,
  inputBg,
  disabled,
  className,
  type = "text",
  secure,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isSecure =
    secure ||
    title === "Password" ||
    title === "Confirm Password" ||
    title?.includes("Pin") ||
    title?.includes("PIN");

  return (
    <div className={clsx("space-y-2", className)}>
      {title ? (
        <label className={clsx("text-base text-white font-normal block pb-2", labelClassName)}>
          {title}
        </label>
      ) : null}
      <div
        className={clsx(
          inputBg || "bg-gray",
          "border w-full h-[46px] px-4 rounded-lg flex items-center gap-2",
          focused ? "border-red" : "border-gray"
        )}
      >
        <input
          className={clsx(
            inputBg || "bg-transparent",
            "flex-1 text-black font-normal text-base h-full outline-none w-full min-w-0"
          )}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          type={isSecure && !show ? "password" : type}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isSecure ? (
          <button type="button" onClick={() => setShow((s) => !s)} className="text-charcoal shrink-0">
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
