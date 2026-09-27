"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

// The store is light-only, so the toaster is pinned to the light theme (no next-themes provider).
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#000",
          "--normal-text": "#fff",
          "--normal-border": "#000",
          "--border-radius": "0px",
        } as React.CSSProperties
      }
      toastOptions={{ classNames: { toast: "cn-toast font-sans" } }}
      {...props}
    />
  )
}

export { Toaster }
