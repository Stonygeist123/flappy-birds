"use client";

export default function Input({
  value,
  setValueAction,
  size = "md",
  placeholder,
  disabled,
  children,
}: {
  value: string;
  setValueAction: React.Dispatch<React.SetStateAction<string>>;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <input
      value={value}
      onChange={(e) => setValueAction(e.currentTarget.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`text-black p-2 rounded-xl outline-none text-center ${
        size === "sm" ? "w-32 h-10" : size === "md" ? "w-40 h-10" : "w-6 h-10"
      }`}
    >
      {children}
    </input>
  );
}
