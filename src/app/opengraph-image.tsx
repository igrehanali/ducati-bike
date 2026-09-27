import { ImageResponse } from "next/og"

export const alt = "Vellora Moto UK — Ride. Perform. Live Vellora"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", width: 160, height: 12, background: "#cc0001" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>VELLORA MOTO UK</div>
          <div style={{ display: "flex", fontSize: 40, color: "rgba(255,255,255,0.8)", letterSpacing: -1 }}>
            Ride. Perform. Live Vellora
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
          <div style={{ display: "flex" }}>Riding gear · Apparel · Accessories</div>
          <div style={{ display: "flex" }}>velloramoto.co.uk</div>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, display: "flex", width: "100%", height: 16, background: "#cc0001" }} />
      </div>
    ),
    { ...size }
  )
}
