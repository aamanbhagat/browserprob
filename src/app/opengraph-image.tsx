import { ImageResponse } from "next/og";

export const alt = "BrowserProbe: see what your browser tells every website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const READINGS = [
  ["Browser and version", "User-agent, Client Hints"],
  ["IP address", "Your request"],
  ["WebRTC addresses", "STUN"],
  ["Canvas and audio", "Rendering samples"],
  ["Screen and fonts", "Sizes, text metrics"],
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: "56px", background: "#f3f5f7", color: "#101820", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "58%", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "32px", fontWeight: 800 }}>
          <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #101820", borderRadius: "50%" }}>
            <div style={{ width: "16px", height: "16px", background: "#0b6b66", borderRadius: "50%" }} />
          </div>
          BrowserProbe
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: "70px", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
          <span>See what your</span>
          <span>browser tells</span>
          <span>every website.</span>
        </div>
        <div style={{ color: "#3b4956", fontSize: "24px" }}>Free browser tests, with the limits of each result explained.</div>
      </div>
      <div style={{ width: "42%", display: "flex", flexDirection: "column", background: "#ffffff", border: "2px solid #dbe1e7", borderTop: "6px solid #101820", borderRadius: "12px" }}>
        <div style={{ display: "flex", padding: "20px 24px", color: "#0b6b66", fontFamily: "monospace", fontSize: "18px", fontWeight: 700, letterSpacing: "0.08em" }}>WHAT THE CHECK READS</div>
        {READINGS.map(([what, source]) => (
          <div key={what} style={{ display: "flex", flexDirection: "column", padding: "14px 24px", borderTop: "2px solid #dbe1e7" }}>
            <span style={{ fontSize: "24px", fontWeight: 700 }}>{what}</span>
            <span style={{ color: "#55626f", fontFamily: "monospace", fontSize: "18px" }}>{source}</span>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
