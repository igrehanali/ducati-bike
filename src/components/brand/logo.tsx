import { cn } from "@/lib/utils"

type LogoProps = {
  /** "light" = white wordmark for dark/photo backgrounds. */
  tone?: "dark" | "light"
  className?: string
  title?: string
}

/** Vellora Moto wordmark — a fictional brand. Shield mark + italic logotype, 120×36 viewBox. */
export function Logo({ tone = "dark", className, title = "Vellora Moto Store UK" }: LogoProps) {
  const ink = tone === "light" ? "#ffffff" : "#111111"
  return (
    <svg viewBox="0 0 120 36" role="img" aria-label={title} className={cn("h-9 w-[120px]", className)} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      {/* Shield */}
      <path d="M2 4.5 15 1l13 3.5v11.2C28 25 22.4 31.6 15 35 7.6 31.6 2 25 2 15.7V4.5Z" fill={tone === "light" ? "#ffffff" : "#cc0001"} />
      {/* Speed V */}
      <path
        d="M7.2 8.5h4.6l3.4 11.4 3.4-11.4h4.6l-6 17.2h-4l-6-17.2Z"
        fill={tone === "light" ? "#cc0001" : "#ffffff"}
      />
      <path d="M21.4 8.5h3.4l-1.2 3.4h-3.4l1.2-3.4Z" fill={tone === "light" ? "#cc0001" : "#ffffff"} opacity="0.7" />
      {/* Wordmark */}
      <text
        x="34"
        y="19.5"
        fill={ink}
        fontFamily="var(--font-inter-family), Inter, Arial, sans-serif"
        fontSize="17"
        fontStyle="italic"
        fontWeight="800"
        letterSpacing="-0.4"
      >
        VELLORA
      </text>
      <text
        x="34.5"
        y="30"
        fill={ink}
        fontFamily="var(--font-inter-family), Inter, Arial, sans-serif"
        fontSize="7.4"
        fontWeight="500"
        letterSpacing="1.35"
      >
        MOTO STORE UK
      </text>
    </svg>
  )
}
