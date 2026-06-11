export interface WebGLInfo {
  supported: boolean;
  version: string;
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxViewportDims: string;
  extensions: string[];
  shadingLanguageVersion: string;
  webgl2: boolean;
}

export function detectWebGL(): WebGLInfo {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl) {
    return {
      supported: false,
      version: "Not supported",
      renderer: "N/A",
      vendor: "N/A",
      maxTextureSize: 0,
      maxViewportDims: "N/A",
      extensions: [],
      shadingLanguageVersion: "N/A",
      webgl2: false,
    };
  }

  const glCtx = gl as WebGLRenderingContext;
  const debugInfo = glCtx.getExtension("WEBGL_debug_renderer_info");
  const webgl2 = !!canvas.getContext("webgl2");

  const maxViewport = glCtx.getParameter(glCtx.MAX_VIEWPORT_DIMS);

  return {
    supported: true,
    version: glCtx.getParameter(glCtx.VERSION) || "Unknown",
    renderer: debugInfo
      ? glCtx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "Hidden",
    vendor: debugInfo
      ? glCtx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : "Hidden",
    maxTextureSize: glCtx.getParameter(glCtx.MAX_TEXTURE_SIZE) || 0,
    maxViewportDims: maxViewport ? `${maxViewport[0]} × ${maxViewport[1]}` : "N/A",
    extensions: glCtx.getSupportedExtensions() || [],
    shadingLanguageVersion: glCtx.getParameter(glCtx.SHADING_LANGUAGE_VERSION) || "Unknown",
    webgl2,
  };
}
