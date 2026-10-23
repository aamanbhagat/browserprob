export interface WebGLInfo {
  supported: boolean;
  version: string;
  renderer: string;
  vendor: string;
  /** Where the renderer string came from. */
  rendererSource: "RENDERER" | "WEBGL_debug_renderer_info" | "none";
  maxTextureSize: number;
  maxViewportDims: string;
  extensions: string[];
  shadingLanguageVersion: string;
  webgl2: boolean;
}

export interface WebGPUInfo {
  status: "available" | "no-adapter" | "not-supported" | "error";
  vendor: string;
  architecture: string;
  device: string;
  description: string;
  isFallbackAdapter: boolean | null;
  featureCount: number;
}

// Chromium and WebKit return a generic placeholder from gl.RENDERER and only expose the driver string
// through WEBGL_debug_renderer_info. Firefox returns a sanitized driver string from gl.RENDERER and marks
// the extension deprecated, so the extension is only requested when the plain value is a placeholder.
export function isPlaceholderRenderer(value: string): boolean {
  return /^(webkit( webgl)?|mozilla)$/i.test(value.trim());
}

function releaseContext(gl: WebGLRenderingContext) {
  gl.getExtension("WEBGL_lose_context")?.loseContext();
}

export function detectWebGL(): WebGLInfo {
  const canvas = document.createElement("canvas");
  const gl2 = canvas.getContext("webgl2");
  const gl = (gl2 || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

  if (!gl) {
    return {
      supported: false,
      version: "Not supported",
      renderer: "N/A",
      vendor: "N/A",
      rendererSource: "none",
      maxTextureSize: 0,
      maxViewportDims: "N/A",
      extensions: [],
      shadingLanguageVersion: "N/A",
      webgl2: false,
    };
  }

  const extensions = gl.getSupportedExtensions() || [];
  let renderer = String(gl.getParameter(gl.RENDERER) || "");
  let vendor = String(gl.getParameter(gl.VENDOR) || "");
  let rendererSource: WebGLInfo["rendererSource"] = renderer ? "RENDERER" : "none";

  if (isPlaceholderRenderer(renderer) && extensions.includes("WEBGL_debug_renderer_info")) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || renderer);
      vendor = String(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || vendor);
      rendererSource = "WEBGL_debug_renderer_info";
    }
  }

  const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
  const info: WebGLInfo = {
    supported: true,
    version: gl.getParameter(gl.VERSION) || "Unknown",
    renderer: renderer || "Hidden",
    vendor: vendor || "Hidden",
    rendererSource,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0,
    maxViewportDims: maxViewport ? `${maxViewport[0]} × ${maxViewport[1]}` : "N/A",
    extensions,
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || "Unknown",
    webgl2: Boolean(gl2),
  };
  releaseContext(gl);
  return info;
}

interface GPUAdapterInfoLike {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
  isFallbackAdapter?: boolean;
}

interface GPUAdapterLike {
  info?: GPUAdapterInfoLike;
  features?: { size: number };
  isFallbackAdapter?: boolean;
}

interface NavigatorWithGPU extends Navigator {
  gpu?: { requestAdapter: () => Promise<GPUAdapterLike | null> };
}

export async function detectWebGPU(): Promise<WebGPUInfo> {
  const empty = { vendor: "", architecture: "", device: "", description: "", isFallbackAdapter: null, featureCount: 0 };
  const gpu = (navigator as NavigatorWithGPU).gpu;
  if (!gpu?.requestAdapter) return { status: "not-supported", ...empty };
  try {
    const adapter = await Promise.race([
      gpu.requestAdapter(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    if (!adapter) return { status: "no-adapter", ...empty };
    const info = adapter.info || {};
    return {
      status: "available",
      vendor: info.vendor || "",
      architecture: info.architecture || "",
      device: info.device || "",
      description: info.description || "",
      isFallbackAdapter: info.isFallbackAdapter ?? adapter.isFallbackAdapter ?? null,
      featureCount: adapter.features?.size ?? 0,
    };
  } catch {
    return { status: "error", ...empty };
  }
}
