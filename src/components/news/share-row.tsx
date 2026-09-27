"use client"

import type { ComponentProps } from "react"
import { Link2 } from "lucide-react"
import { toast } from "sonner"

type IconProps = ComponentProps<"svg">

function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
    </svg>
  )
}

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.55V4.64c-.27-.04-1.19-.12-2.26-.12-2.24 0-3.77 1.37-3.77 3.87v2.17H7.95v2.94h2.53V21h3.02Z" />
    </svg>
  )
}

function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.97L2 22l5.16-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.07.9.9-3-.2-.31a8.2 8.2 0 1 1 6.85 3.74Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3c-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.54.13.16 1.73 2.64 4.2 3.7.58.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  )
}

const itemClass =
  "inline-flex size-10 items-center justify-center border border-rule bg-white text-black transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"

export function ShareRow({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { label: "Share on X", href: `https://x.com/intent/post?url=${u}&text=${t}`, icon: XIcon },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: FacebookIcon },
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: WhatsAppIcon },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      toast("Link copied to clipboard")
    } catch {
      toast("Couldn't copy the link — please copy it from the address bar.")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-sm leading-[17px] font-semibold tracking-[-0.3px] uppercase">Share this story</p>
      <ul className="flex items-center gap-2">
        <li>
          <button type="button" onClick={copyLink} aria-label="Copy link" title="Copy link" className={itemClass}>
            <Link2 className="size-[18px]" aria-hidden="true" />
          </button>
        </li>
        {links.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} title={label} className={itemClass}>
              <Icon className="size-[18px]" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
