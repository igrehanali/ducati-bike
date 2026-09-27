import { cn } from "@/lib/utils"
import { QtyMinusIcon, QtyPlusIcon } from "@/components/icons"

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  size?: "default" | "sm"
  className?: string
}

export function QuantityStepper({ value, onChange, min = 1, size = "default", className }: QuantityStepperProps) {
  const sm = size === "sm"
  const icon = sm ? "size-[21px]" : "size-7"

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between border border-black bg-white",
        sm ? "h-8 w-[85px] px-3 [border-width:0.76px]" : "h-[42px] w-28 px-4",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="disabled:opacity-40"
      >
        <QtyMinusIcon className={icon} />
      </button>
      <span className={cn("text-center font-medium tabular-nums", sm ? "text-[10.67px] leading-4" : "text-sm leading-[21px]")}>
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)}>
        <QtyPlusIcon className={icon} />
      </button>
    </div>
  )
}
