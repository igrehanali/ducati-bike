import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

type PriceProps = {
  value: number
  compareAt?: number
  className?: string
  /** Weight of the current price; the compare-at price is always regular. */
  emphasis?: boolean
  gap?: string
}

export function Price({ value, compareAt, className, emphasis = false, gap = "gap-4" }: PriceProps) {
  return (
    <p className={cn("flex items-center font-mono tracking-[-0.3px]", gap, className)}>
      <span className={emphasis ? "font-semibold" : "font-normal"}>{formatPrice(value)}</span>
      {compareAt ? (
        <s className="font-normal text-subtle">
          <span className="sr-only">Was </span>
          {formatPrice(compareAt)}
        </s>
      ) : null}
    </p>
  )
}
