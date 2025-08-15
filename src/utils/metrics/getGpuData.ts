export const fetchGpuInfo = async (): Promise<{
  renderer: string;
  vendor: string;
  version: string;
}> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      
      // Try multiple WebGL contexts for better Capacitor compatibility
      const gl = (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2")) as WebGLRenderingContext | WebGL2RenderingContext | null;

      if (!gl) {
        // Fallback for environments where WebGL is not available
        resolve({
          renderer: "Unknown",
          vendor: "Unknown", 
          version: "Unknown"
        });
        return;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      if (debugInfo) {
        const gpuInfo = {
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Unknown",
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Unknown",
          version: gl.getParameter(gl.VERSION) as string || "Unknown",
        };
        resolve(gpuInfo);
      } else {
        // Fallback when debug info is not available (common in Capacitor)
        const renderer = gl.getParameter(gl.RENDERER) || "Unknown";
        const vendor = gl.getParameter(gl.VENDOR) || "Unknown";
        const version = gl.getParameter(gl.VERSION) as string || "Unknown";
        
        resolve({
          renderer,
          vendor,
          version
        });
      }
    } catch (error) {
      // Return default values instead of rejecting
      resolve({
        renderer: "Unknown",
        vendor: "Unknown",
        version: "Unknown"
      });
    }
  });
};
