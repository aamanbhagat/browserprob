import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What the WebRTC leak test checks",
      body: `WebRTC lets browsers set up direct audio, video and data connections. To find a path between two peers, the browser gathers **ICE candidates**: possible addresses at which it can be reached. Any web page can trigger this without asking for camera or microphone permission, and read the addresses in the candidates.

This test gathers those candidates and compares every address in them with the IP address this site sees for your normal page requests. A "leak" means WebRTC revealed an address that your VPN or proxy was supposed to hide.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `The page creates an \`RTCPeerConnection\` that uses Cloudflare's public STUN server (\`stun.cloudflare.com:3478\`). It opens an empty data channel and creates an offer, which starts candidate gathering. Each candidate is parsed for its address, protocol and type. Gathering stops when the browser signals it is finished, or after five seconds.

Candidate types tell you where an address came from:

- **host:** an address of a network interface on this device.
- **srflx (server reflexive):** the public address and port the STUN server saw the request come from.
- **prflx and relay:** addresses learned from a peer or a TURN relay. This test has no peer or relay, so they don't normally appear.

At the same time, the page asks this site's \`/api/ip\` endpoint which address the page request came from, and compares the two sets.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `- **"WebRTC shows the same public address this site sees":** the STUN server saw the same address as your page request. Nothing extra was revealed. With a VPN on, both should be the VPN's exit address.
- **"WebRTC revealed a different public address":** a public address of the same family (IPv4 or IPv6) appeared that is not the one your page request came from. If you are using a VPN and that address belongs to your own internet provider, WebRTC is bypassing the VPN. This is the classic leak.
- **"WebRTC found an address of the other IP family":** this page loaded over IPv4, for example, while WebRTC also produced an IPv6 address. Dual-stack connections normally have both. It is only a leak if that address is your provider's while a VPN is supposed to hide it.
- **"A local network address is visible":** a private or link-local address appeared in a host candidate. That reveals something about your local network rather than your public route.
- **"Local addresses are hidden":** host candidates used random \`.local\` names instead of real addresses, which is how current browsers protect them by default.`,
    },
    {
      id: "limitations",
      heading: "What this test can't decide for you",
      body: `BrowserProbe does not know which address you expect. A public WebRTC address is only a problem if it differs from the exit address your VPN or proxy should be using, and that is something you have to compare. The table of candidates is there so you can do so.

Results vary by browser, operating system and VPN. Some VPN clients route WebRTC traffic correctly; some browser extensions block it entirely. A firewall that blocks UDP can stop gathering altogether, which shows up as the five-second timeout. A clean result describes this browser on this network right now. It does not guarantee that a different site, browser profile or network will behave the same way.

Running the test sends STUN requests to Cloudflare, which sees the address they come from. BrowserProbe receives nothing from it.`,
    },
    {
      id: "fixes",
      heading: "How to fix a WebRTC leak",
      body: `1. **Confirm the leak:** connect your VPN, run this test, and check whether any public address in the table belongs to your own provider rather than to the VPN. The [IP address test](/tools/what-is-my-ip) shows what normal requests reveal.
2. **Turn on your VPN's WebRTC or leak protection,** if it has one, or use its full-tunnel mode rather than split tunnelling.
3. **In Firefox,** you can switch WebRTC off entirely by setting \`media.peerconnection.enabled\` to \`false\` in \`about:config\`. Video calls in the browser will stop working.
4. **In Chromium-based browsers,** administrators can restrict WebRTC to the default route or to proxied traffic with the \`WebRtcIPHandling\` policy. Brave offers a similar choice under its privacy settings.
5. **Run the test again** after each change, and check that the calling services you rely on still work.`,
    },
  ],
  faq: [
    {
      question: "What is a WebRTC IP leak?",
      answer: "It is when WebRTC candidate gathering reveals an IP address that a VPN or proxy was supposed to hide, typically the public address of your own internet provider. A public candidate that matches the address websites already see is not a leak.",
    },
    {
      question: "Does WebRTC need camera or microphone permission to reveal my IP?",
      answer: "No. A page can create a connection with only a data channel and read the candidates without any permission prompt. Current browsers usually replace local addresses with random .local names, at least until the page has been granted camera or microphone access.",
    },
    {
      question: "Why does the test show both an IPv4 and an IPv6 address?",
      answer: "Your connection probably has both, and the STUN server can be reached over each. That alone is normal; check whether either address belongs to your provider instead of your VPN.",
    },
    {
      question: "Should I disable WebRTC completely?",
      answer: "Only if you never use browser-based calls and your VPN cannot protect WebRTC traffic. Disabling it breaks video calls and some file-sharing tools. Fixing the VPN or browser routing is usually the better option.",
    },
  ],
  sources: [
    { title: "RFC 8828: WebRTC IP Address Handling Requirements", url: "https://www.rfc-editor.org/rfc/rfc8828.html" },
    { title: "IETF draft: Using Multicast DNS to protect privacy when exposing ICE candidates", url: "https://datatracker.ietf.org/doc/html/draft-ietf-mmusic-mdns-ice-candidates" },
    { title: "MDN: RTCIceCandidate.type", url: "https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type" },
    { title: "MDN: RTCPeerConnection", url: "https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection" },
  ],
};

export default content;
