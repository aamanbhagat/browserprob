import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "Your **public IP address** identifies a network route, not necessarily one device or person. It may be shared by a household, workplace, mobile carrier, VPN, or carrier-grade NAT gateway.\n\n**IPv4** addresses look like `192.168.1.1` and are the most common format. **IPv6** addresses are longer (like `2001:db8::1`) and were created because the world is running out of IPv4 addresses.\n\nIf you're using a **VPN**, compare this result with the exit address shown by your VPN provider. BrowserProbe cannot independently know which address you expected, so it does not automatically declare a VPN failure.",
    },
  ],
  faq: [
    { question: "What is the difference between IPv4 and IPv6?", answer: "IPv4 addresses are 32-bit numeric values (e.g., 192.168.1.1), while IPv6 addresses are 128-bit hexadecimal values (e.g., 2001:db8::1) designed to accommodate the vastly growing number of internet devices." },
    { question: "Can a website see my actual IP address if I use a VPN?", answer: "If your VPN is working correctly, websites should only see the VPN server's public IP address. However, if your browser has WebRTC leaks enabled, it might still expose your real local or public IP address." },
  ],
  sources: [],
};

export default content;
