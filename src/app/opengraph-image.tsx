import { ImageResponse } from "next/og";

export const alt = "BrowserProbe diagnostic passport — browser facts, findings, and limits";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: "54px", background: "#eef3f8", color: "#10233d", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", background: "#ffffff", border: "2px solid #c4d0de", borderTop: "10px solid #2458e8", borderRadius: "16px", padding: "42px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: "28px", fontWeight: 800 }}>
            <div style={{ width: "58px", height: "58px", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #2458e8", borderRadius: "50%", color: "#2458e8", fontSize: "19px" }}>BP</div>
            BrowserProbe
          </div>
          <div style={{ color: "#2458e8", fontSize: "18px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Diagnostic passport</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "42px" }}>
          <div style={{ width: "68%", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#2458e8", fontFamily: "monospace", fontSize: "18px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Instant browser inspection</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "16px", fontSize: "68px", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.98 }}><span>Your browser,</span><span>explained.</span></div>
            <div style={{ marginTop: "24px", color: "#465a70", fontSize: "24px", lineHeight: 1.4 }}>Clear browser facts, evidence-based privacy findings, and honest limitations.</div>
          </div>
          <div style={{ width: "32%", display: "flex", flexDirection: "column", border: "2px solid #dce4ee", borderRadius: "10px" }}>
            {["Observed facts", "Confidence labels", "No app report database"].map((label, index) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px", borderBottom: index < 2 ? "2px solid #dce4ee" : "none", fontSize: "20px", fontWeight: 700 }}>
                <span style={{ color: index === 1 ? "#b84b22" : "#0e7068" }}>0{index + 1}</span>{label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "20px", borderTop: "2px solid #dce4ee", color: "#5d6d82", fontFamily: "monospace", fontSize: "17px" }}>
          <span>browserprobe.app</span><span>Facts · findings · limits</span>
        </div>
      </div>
    </div>,
    size,
  );
}
