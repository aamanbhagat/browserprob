import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test shows",
      body: `Any website can ask your browser which cameras, microphones and audio outputs exist, without a permission prompt and without being able to use them. This test shows what that request returns in your browser:

- how many devices of each kind are visible;
- whether each device's **name** is visible;
- whether a per-site **device ID** is exposed.

You can also choose to reveal the device names, to see what a site learns once you grant camera or microphone access.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `On load, the page calls \`navigator.mediaDevices.enumerateDevices()\` and counts the entries by kind (\`audioinput\`, \`audiooutput\`, \`videoinput\`). It does not invent placeholder names: if the browser returns an empty name, the table says "Hidden until you grant permission".

The **Show device names** button calls \`getUserMedia()\` for the kinds that exist, so your browser shows its normal permission prompt. If you allow it, the page stops every camera and microphone track immediately, without displaying, recording or uploading anything, and lists the devices again. If you deny it, the page explains which error the browser returned.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `Before permission, browsers deliberately limit the list. Chromium-based browsers typically show one entry per kind with no name, whatever the number of devices you actually have. Firefox and Safari apply their own rules, so the counts are a lower bound, not an inventory.

After you grant permission, the list usually shows every device by its real name, such as a built-in camera or a headset model, together with stable per-site IDs. That is the moment the list becomes far more identifying. Browsers can remember that permission, in which case a site you once allowed can read the names again on later visits.

A count of zero can mean there are no devices, or that the browser or operating system blocked enumeration.`,
    },
    {
      id: "limitations",
      heading: "What this test can't see",
      body: `The test only sees what the browser reports. It cannot check whether a camera actually works, which apps are using it, or whether a hardware privacy shutter is closed. Operating-system privacy settings (on macOS, Windows, iOS and Android) can block a browser's access entirely, and the error then looks the same as a denied prompt.

The API also only exists on secure (HTTPS) pages. Firefox has listed audio output devices only since version 116. Audio outputs can be missing in browsers that don't support choosing a speaker.`,
    },
    {
      id: "fixes",
      heading: "Managing camera and microphone access",
      body: `- **Review site permissions:** in Chrome and Edge, open Settings → Privacy and security → Site settings → Camera or Microphone. In Firefox, open Settings → Privacy & Security → Permissions. In Safari, open Settings → Websites. Remove sites you no longer use.
- **Grant access only while you need it.** Most browsers offer "Allow this time" or let you revoke access from the address bar.
- **Check the operating system's privacy settings** if a call app cannot find your camera even though the browser allows it.

Revoking permission hides the device names from that site again.`,
    },
  ],
  faq: [
    {
      question: "Can websites access my camera and microphone without permission?",
      answer: "No. Capturing audio or video always requires your permission. Without it, a site can only learn which kinds of devices exist, usually without their names.",
    },
    {
      question: "Does the Show device names button record anything?",
      answer: "No. It requests access only so the browser reveals the device names, then stops every track straight away. Nothing is displayed, recorded or sent to BrowserProbe.",
    },
    {
      question: "Why does the test show one camera when I have two?",
      answer: "Before permission, Chromium-based browsers report at most one device of each kind, so pages cannot count your hardware precisely. After you grant access, the full list appears.",
    },
  ],
  sources: [
    { title: "MDN: MediaDevices.enumerateDevices()", url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices" },
    { title: "MDN: MediaDevices.getUserMedia()", url: "https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia" },
    { title: "W3C: Media Capture and Streams (privacy of device information)", url: "https://www.w3.org/TR/mediacapture-streams/" },
  ],
};

export default content;
