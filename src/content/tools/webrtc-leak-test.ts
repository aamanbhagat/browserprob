import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**WebRTC** (Web Real-Time Communication) uses ICE candidates to establish peer-to-peer connections. Modern browsers often mask local addresses with mDNS, while a STUN service can still produce a public network candidate.\n\nA public candidate that matches the IP already visible to the site is **not automatically a leak**. A meaningful VPN check requires comparing the observed address with the exit address your VPN says it is using.\n\nA different IPv4 and IPv6 address can still describe the same connection. Treat a mismatch as a prompt to compare with your provider—not proof of bypass on its own.\n\nThis test contacts Cloudflare's public STUN endpoint to gather candidates. Review the raw addresses and comparison above before changing WebRTC or VPN settings.",
    },
  ],
  faq: [
    { question: "What is a WebRTC IP leak?", answer: "A WebRTC leak is a mismatch between the network address a privacy tool is expected to expose and an address revealed in WebRTC ICE candidates. A public candidate by itself is not proof of a VPN leak; it must be compared with the expected VPN exit address." },
    { question: "How do I fix a WebRTC leak?", answer: "First confirm that the observed address differs from the exit address expected from your VPN or proxy. If it does, review the VPN client's WebRTC protection, browser privacy settings, or enterprise policy before disabling WebRTC entirely." },
  ],
  sources: [],
};

export default content;
