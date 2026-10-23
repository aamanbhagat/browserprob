import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test shows",
      body: `This page shows the IP address BrowserProbe's server saw your request arrive from. That is the public address every website you visit sees too. Usually it belongs to your internet provider, mobile carrier, VPN, proxy or workplace network, not to your device itself.

Along with the address, the page shows:

- **Address family:** whether the request used IPv4 or IPv6.
- **Address type:** whether the address is publicly routable or falls in a reserved range, such as a private network, loopback or carrier-grade NAT space.
- **Approximate location and time zone:** these come from the IP geolocation database of our hosting provider (Vercel), when it supplies one.`,
    },
    {
      id: "how-it-works",
      heading: "How the address is found",
      body: `Your browser makes one request to \`/api/ip\` on this site. The server reads the connecting address from the request headers that the hosting platform sets (\`x-vercel-forwarded-for\`, then \`x-forwarded-for\`), and takes the first valid entry. Vercel overwrites these headers itself, so a browser cannot fake the value by sending its own. Addresses that arrive in IPv4-mapped IPv6 form, such as \`::ffff:203.0.113.7\`, are converted back to plain IPv4.

The address is then classified against the IANA special-purpose address registries. For example, \`100.64.0.0/10\` is shared space used for carrier-grade NAT, \`fc00::/7\` holds IPv6 unique local addresses, and \`192.0.2.0/24\` is reserved for documentation.

The response is sent back to your tab with caching disabled. The server does not write it to a database and does not contact any other service to look anything up.`,
    },
    {
      id: "reading",
      heading: "Reading the result",
      body: `**IP address** is the address websites see for this connection. If you share a network, other people on it may appear with the same address.

**Address family** tells you which protocol carried the request. One request travels over either IPv4 or IPv6, never both. A dual-stack connection therefore has a second address that this page cannot see. Your browser picks a family per connection, so reloading can occasionally switch between them.

**Address type** should read "Public" on the live site. Any other value means the request did not reach the server directly from the internet: for example, you are running the site on your own machine, or a proxy in between did not pass your address on.

**Approximate location** is a database estimate tied to the address block, not a measurement of where you are. It is typically right about the country, less reliable about the city, and often wrong for mobile networks, VPNs and satellite connections.`,
    },
    {
      id: "limitations",
      heading: "Limits of an IP lookup",
      body: `An IP address identifies a route into the internet, not a person. Many households share one IPv4 address behind their router, and mobile carriers put thousands of customers behind a single carrier-grade NAT address. A VPN replaces your provider's address with its own exit address, which this page will show instead.

IPv6 addresses are often temporary. Operating systems that use privacy extensions (RFC 8981) generate new interface identifiers regularly, by default every day, so your IPv6 address can change while your network stays the same.

This page also cannot tell whether a VPN is working as intended. It only shows the one address your browser used to reach it. To check for addresses exposed through WebRTC, run the [WebRTC leak test](/tools/webrtc-leak-test) while your VPN is connected.`,
    },
    {
      id: "fixes",
      heading: "Changing the address websites see",
      body: `- **To get a different public address:** restart your router (many providers hand out dynamic addresses), or switch between Wi-Fi and mobile data.
- **To hide your provider's address from websites:** use a VPN or a privacy network such as Tor. Websites will see the VPN's or exit node's address instead, and the operator of that service can see your traffic metadata.
- **If the location looks wrong:** this is a database issue rather than a problem with your connection. Your internet provider, or the geolocation database vendor, is the one who can correct it.`,
    },
  ],
  faq: [
    {
      question: "What is the difference between IPv4 and IPv6?",
      answer: "IPv4 addresses are 32-bit numbers written as four decimal parts, such as 203.0.113.7. IPv6 addresses are 128-bit and written in hexadecimal groups, such as 2001:db8::1. Many connections have both; each request uses one of them.",
    },
    {
      question: "Why doesn't this page show both my IPv4 and IPv6 address?",
      answer: "A single request travels over only one protocol, so the server only learns that one address. Showing the other would require a second request to a server that is reachable over only that protocol.",
    },
    {
      question: "Can a website see my real IP address while I use a VPN?",
      answer: "Not through normal requests if the VPN routes all traffic. The page request then arrives from the VPN's exit address. WebRTC is the usual exception worth checking, because it can reveal additional addresses if the VPN or browser does not handle it.",
    },
    {
      question: "Does BrowserProbe store my IP address?",
      answer: "The application does not store it. The hosting provider keeps standard request logs, which include IP addresses, for a limited time; the [privacy policy](/privacy-policy) explains this.",
    },
  ],
  sources: [
    { title: "IANA IPv4 Special-Purpose Address Registry", url: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml" },
    { title: "IANA IPv6 Special-Purpose Address Registry", url: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml" },
    { title: "RFC 6598: IANA-Reserved IPv4 Prefix for Shared Address Space", url: "https://www.rfc-editor.org/rfc/rfc6598.html" },
    { title: "RFC 8981: Temporary Address Extensions for Stateless Address Autoconfiguration in IPv6", url: "https://www.rfc-editor.org/rfc/rfc8981.html" },
    { title: "Vercel: Request headers", url: "https://vercel.com/docs/headers/request-headers" },
  ],
};

export default content;
