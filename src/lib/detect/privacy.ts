export interface PrivacyInfo {
  doNotTrack: string;
  globalPrivacyControl: string;
  cookiesEnabled: boolean;
  thirdPartyCookiesBlocked: string;
  adBlocker: string;
  privateMode: string;
}

interface NavigatorWithGPC extends Navigator {
  globalPrivacyControl?: boolean;
}

export function detectPrivacy(): PrivacyInfo {
  const nav = navigator as NavigatorWithGPC;

  // DNT
  const dnt = navigator.doNotTrack;
  let doNotTrack = "Not set";
  if (dnt === "1") doNotTrack = "Enabled";
  else if (dnt === "0") doNotTrack = "Disabled";

  // GPC
  const gpc = nav.globalPrivacyControl;
  let globalPrivacyControl = "Not supported";
  if (gpc === true) globalPrivacyControl = "Enabled";
  else if (gpc === false) globalPrivacyControl = "Disabled";

  return {
    doNotTrack,
    globalPrivacyControl,
    cookiesEnabled: navigator.cookieEnabled,
    thirdPartyCookiesBlocked: "Check requires iframe test",
    adBlocker: "Detection not implemented",
    privateMode: "Cannot be reliably detected",
  };
}

export interface WebRTCLeak {
  localIPs: string[];
  supported: boolean;
}

export async function detectWebRTCLeak(): Promise<WebRTCLeak> {
  if (typeof RTCPeerConnection === "undefined") {
    return { localIPs: [], supported: false };
  }

  return new Promise((resolve) => {
    const ips: string[] = [];
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pc.createDataChannel("");
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      const timeout = setTimeout(() => {
        pc.close();
        resolve({ localIPs: ips, supported: true });
      }, 3000);

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          clearTimeout(timeout);
          pc.close();
          resolve({ localIPs: ips, supported: true });
          return;
        }
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(
          /(\d{1,3}\.(\d{1,3}\.){2}\d{1,3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        );
        if (ipMatch && !ips.includes(ipMatch[1])) {
          ips.push(ipMatch[1]);
        }
      };
    } catch {
      resolve({ localIPs: [], supported: false });
    }
  });
}
