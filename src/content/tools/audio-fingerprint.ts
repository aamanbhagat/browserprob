import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What audio fingerprinting is",
      body: `The Web Audio API can generate and process sound entirely in software. A script can run a known signal through the same chain of audio nodes and read the output samples. The output can differ slightly between browsers and platforms, because floating-point math and the implementation of each node vary. Summarizing that output gives a value that can serve as one more fingerprinting signal, and no sound ever plays.

This test reproduces that technique so you can see your result and whether your browser keeps it stable.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `The page creates an \`OfflineAudioContext\`: one channel, 4,096 samples at 44,100 Hz. That context renders into memory instead of to your speakers. In it, a 10 kHz triangle-wave oscillator feeds a dynamics compressor with fixed settings (threshold −50 dB, knee 40, ratio 12, attack 0, release 0.25 s). The rendered samples are rounded to six decimal places and hashed into a 16-character sample ID.

The page renders the same graph a second time and compares the two IDs. It never creates a live \`AudioContext\`, so nothing reaches an audio device and autoplay rules are not involved. If a render does not finish within two seconds, the test says so instead of showing a value.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `- **"Both renders matched":** your browser processes this audio deterministically. That is typical, and it means the ID could be reused as a signal. The same ID is shared by everyone with the same browser build on a similar platform, so it narrows things down far less than a canvas or font result usually does.
- **"The two renders differ":** your browser altered the output between identical renders. That is a deliberate protection against this technique.
- **"The render did not finish":** some privacy modes stall offline rendering. The signal is then simply unavailable.

**Sample rate used** is the rate the test requested (44,100 Hz). It is not your sound card's rate.`,
    },
    {
      id: "limitations",
      heading: "Limits of the audio signal",
      body: `Audio results mostly reflect the browser engine and its version rather than your hardware, because offline rendering runs in software. Updating the browser often changes the ID. Treat a match between two browsers as "same engine build", not as "same device".

Like the canvas test, a matching pair of renders does not rule out protection. Defenses that seed their noise per site and per session, as Brave does, produce the same value twice on one page and a different value elsewhere.`,
    },
    {
      id: "fixes",
      heading: "Reducing audio fingerprinting",
      body: `Browser-level protection works better than add-ons here. Brave varies Web Audio output per site and session. Firefox's fingerprinting protection in Private Browsing and Strict mode covers more APIs since version 145. Tor Browser standardizes values across its users.

Because the audio signal is weak on its own, it rarely matters in isolation. Reducing the stronger signals (fonts, canvas, screen size, IP address) does more for your privacy than chasing this one.`,
    },
  ],
  faq: [
    {
      question: "Does audio fingerprinting play sound or use my microphone?",
      answer: "No. The test renders into memory with an OfflineAudioContext, so nothing is played, and it never asks for or uses a microphone.",
    },
    {
      question: "Why did my audio ID change after a browser update?",
      answer: "The rendered samples depend on the browser's audio implementation, which can change between versions. That is one reason the audio signal alone is unreliable for tracking.",
    },
    {
      question: "Is an audio fingerprint unique to my computer?",
      answer: "Usually not. It is mostly shared by everyone running the same browser build on a similar system; on its own it separates groups of people rather than individuals.",
    },
  ],
  sources: [
    { title: "MDN: OfflineAudioContext", url: "https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext" },
    { title: "MDN: DynamicsCompressorNode", url: "https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode" },
    { title: "Brave: Fingerprinting protections (randomization seed)", url: "https://github.com/brave/brave-browser/wiki/Fingerprinting-Protections" },
  ],
};

export default content;
