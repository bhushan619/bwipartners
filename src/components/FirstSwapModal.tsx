import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FirstSwapModalProps {
  partnerName: string;
  currency: string;
  isOpen: boolean;
  onSwap: () => void;
  onDismiss: () => void;
}

function ModalButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "text";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl px-4 py-3 text-sm font-bold transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function FirstSwapModal({
  partnerName,
  currency,
  isOpen,
  onSwap,
  onDismiss,
}: FirstSwapModalProps) {
  if (!isOpen) return null;

  const handleSwap = () => {
    // eslint-disable-next-line no-console
    console.log("swap started");
    onSwap();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-swap-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/55 p-4"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-[340px] rounded-2xl bg-card p-6 text-center shadow-frame"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
            <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M18 9h-5" />
            <path d="M18 15h-5" />
            <path d="M6 9h5" />
            <path d="M6 15h5" />
          </svg>
        </div>

        <h2
          id="first-swap-title"
          className="mt-5 font-display text-xl font-extrabold text-navy"
        >
          Turn your {partnerName} balance into digital dollars
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Protect your money from {currency} drops. Swap to USDT in under a minute — no new account needed.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3 text-[11px] font-semibold text-foreground">
          <span className="flex items-center gap-1">
            <Check className="size-3.5 text-primary" />
            Under 1 minute
          </span>
          <span className="flex items-center gap-1">
            <Check className="size-3.5 text-primary" />
            No new signup
          </span>
          <span className="flex items-center gap-1">
            <Check className="size-3.5 text-primary" />
            Withdraw anytime
          </span>
        </div>

        <div className="mt-6 space-y-2">
          <ModalButton onClick={handleSwap} variant="primary">
            Swap now
          </ModalButton>
          <ModalButton onClick={onDismiss} variant="text">
            Maybe later
          </ModalButton>
        </div>
      </div>
    </div>
  );
}
