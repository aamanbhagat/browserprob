import type { ToolContent } from "@/content/types";
import what_is_my_browser from "./what-is-my-browser";
import what_is_my_ip from "./what-is-my-ip";
import screen_resolution from "./screen-resolution";
import javascript_info from "./javascript-info";
import cookies_test from "./cookies-test";
import webrtc_leak_test from "./webrtc-leak-test";
import canvas_fingerprint from "./canvas-fingerprint";
import webgl_info from "./webgl-info";
import font_detection from "./font-detection";
import audio_fingerprint from "./audio-fingerprint";
import browser_plugins from "./browser-plugins";
import do_not_track from "./do-not-track";
import connection_speed from "./connection-speed";
import hardware_info from "./hardware-info";
import timezone_locale from "./timezone-locale";
import media_devices from "./media-devices";
import browser_features from "./browser-features";
import client_hints from "./client-hints";

const toolContent: Record<string, ToolContent> = {
  "what-is-my-browser": what_is_my_browser,
  "what-is-my-ip": what_is_my_ip,
  "screen-resolution": screen_resolution,
  "javascript-info": javascript_info,
  "cookies-test": cookies_test,
  "webrtc-leak-test": webrtc_leak_test,
  "canvas-fingerprint": canvas_fingerprint,
  "webgl-info": webgl_info,
  "font-detection": font_detection,
  "audio-fingerprint": audio_fingerprint,
  "browser-plugins": browser_plugins,
  "do-not-track": do_not_track,
  "connection-speed": connection_speed,
  "hardware-info": hardware_info,
  "timezone-locale": timezone_locale,
  "media-devices": media_devices,
  "browser-features": browser_features,
  "client-hints": client_hints,
};

export function getToolContent(slug: string): ToolContent {
  const content = toolContent[slug];
  if (!content) throw new Error(`No content for tool: ${slug}`);
  return content;
}

export const toolContentBySlug = toolContent;
