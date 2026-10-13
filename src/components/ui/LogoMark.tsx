import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function LogoMark({ className }: Props) {
  return (
    <svg aria-hidden className={cn("size-9 shrink-0", className)} viewBox="0 0 32 32">
      <rect fill="#111827" height="32" rx="8" width="32" />
      <circle cx="9" cy="16" fill="#FFD43B" r="3.2" />
      <circle cx="22.5" cy="9.5" fill="#4D6BFF" r="2.3" />
      <circle cx="23" cy="22.5" fill="#F8FAFC" r="2.3" />
      <path d="M12.1 14.7 20.2 10.6M12.2 17.3 20.6 21.4" fill="none" stroke="#FFD43B" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}
