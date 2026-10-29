'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

const vertexSource = `
attribute vec2 a_uv;
uniform float u_time;
varying vec2 v_uv;
float region(vec2 p, vec2 centre, vec2 spread) {
  vec2 d = (p - centre) / spread;
  return exp(-dot(d, d) * 1.7);
}
void main() {
  v_uv = a_uv;
  vec2 p = a_uv;
  float t = u_time;
  // Keep a visible light breeze between the occasional stronger gusts.
  float breeze = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(t * 0.23 - 0.8), 3.0);
  // Independent branch regions: different phases, speeds and local pivots.
  float left = region(p, vec2(0.23, 0.43), vec2(0.30, 0.34));
  float right = region(p, vec2(0.78, 0.42), vec2(0.29, 0.35));
  float crown = region(p, vec2(0.49, 0.19), vec2(0.38, 0.28));
  float lower = region(p, vec2(0.68, 0.66), vec2(0.29, 0.22));
  vec2 movement = vec2(0.0);
  movement += left * vec2(sin(t * 0.72 + 0.7) * 0.009, cos(t * 0.61) * 0.0035);
  movement += right * vec2(sin(t * 0.61 + 2.4) * 0.010, sin(t * 0.78 + 1.1) * 0.004);
  movement += crown * vec2(sin(t * 0.85 + 4.0) * 0.008, cos(t * 0.67 + 0.8) * 0.0025);
  movement += lower * vec2(sin(t * 0.91 + 1.6) * 0.0055, sin(t * 0.69 + 3.0) * 0.0035);
  // Finer foliage flutter sits on top of the slower branch motion.
  movement += vec2(
    sin(p.x * 91.0 + p.y * 43.0 + t * 2.8) * 0.002,
    sin(p.y * 87.0 - p.x * 51.0 + t * 3.3) * 0.0013
  );
  // Fix the main trunk and all points near the ground exactly in place.
  float trunk = (1.0 - smoothstep(0.035, 0.115, abs(p.x - 0.495))) * smoothstep(0.33, 0.56, p.y);
  float canopy = (1.0 - smoothstep(0.68, 0.81, p.y)) * (1.0 - trunk);
  p += movement * canopy * breeze;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D u_tree;
varying vec2 v_uv;
void main() { gl_FragColor = texture2D(u_tree, v_uv); }
`;

export function CanopyBreeze({ image, active }: { image: RefObject<HTMLImageElement | null>; active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const running = useRef(active);
  const synchronize = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [contextVersion, setContextVersion] = useState(0);

  useEffect(() => { running.current = active; synchronize.current?.(); }, [active]);

  useEffect(() => {
    const surface = canvas.current;
    const photo = image.current;
    if (!surface || !photo) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const gl = surface.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, depth: false, stencil: false });
    // The accessible photo remains visible if WebGL is unavailable or fails.
    if (!gl) return;
    let frame = 0, elapsed = 0, previous = 0, lastPaint = 0;
    let initialized = false, lost = false, disposed = false;
    const shaders: WebGLShader[] = [];
    const buffers: WebGLBuffer[] = [];
    const program = gl.createProgram();
    const texture = gl.createTexture();
    if (!program || !texture) {
      if (program) gl.deleteProgram(program);
      if (texture) gl.deleteTexture(texture);
      return;
    }

    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error('Shader unavailable');
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error('Shader compilation failed');
      gl!.attachShader(program!, shader);
    }

    let time: WebGLUniformLocation | null = null;
    let indexCount = 0;
    function draw() {
      if (!initialized || lost || disposed) return;
      gl!.viewport(0, 0, surface!.width, surface!.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(time, elapsed / 1000);
      gl!.drawElements(gl!.TRIANGLES, indexCount, gl!.UNSIGNED_SHORT, 0);
    }
    function tick(now: number) {
      frame = 0;
      if (!running.current || preference.matches || lost || disposed) return;
      if (previous) elapsed += Math.min(now - previous, 100);
      previous = now;
      // Cap rendering at 30fps; there is no animation loop while stopped.
      if (now - lastPaint >= 1000 / 30) { draw(); lastPaint = now; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      setReady(initialized && !lost && !preference.matches);
      if (initialized && running.current && !preference.matches && !lost && !disposed) frame = requestAnimationFrame(tick);
    }
    function resize() {
      if (disposed || lost) return;
      const size = Math.max(1, Math.min(960, Math.round(surface!.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5))));
      if (surface!.width !== size) { surface!.width = size; surface!.height = size; }
      draw();
    }
    function initialize() {
      if (disposed || initialized || !photo!.naturalWidth) return;
      try {
        compile(gl!.VERTEX_SHADER, vertexSource);
        compile(gl!.FRAGMENT_SHADER, fragmentSource);
        gl!.linkProgram(program!);
        if (!gl!.getProgramParameter(program!, gl!.LINK_STATUS)) throw new Error('Program linking failed');
        gl!.useProgram(program!);
        const divisions = 96;
        const vertices = new Float32Array((divisions + 1) ** 2 * 2);
        const indices = new Uint16Array(divisions * divisions * 6);
        let v = 0, i = 0;
        for (let y = 0; y <= divisions; y++) for (let x = 0; x <= divisions; x++) { vertices[v++] = x / divisions; vertices[v++] = y / divisions; }
        for (let y = 0; y < divisions; y++) for (let x = 0; x < divisions; x++) {
          const a = y * (divisions + 1) + x, b = a + divisions + 1;
          indices[i++] = a; indices[i++] = b; indices[i++] = a + 1;
          indices[i++] = a + 1; indices[i++] = b; indices[i++] = b + 1;
        }
        const vertexBuffer = gl!.createBuffer(), indexBuffer = gl!.createBuffer();
        if (!vertexBuffer || !indexBuffer) { if (vertexBuffer) gl!.deleteBuffer(vertexBuffer); if (indexBuffer) gl!.deleteBuffer(indexBuffer); throw new Error('Buffers unavailable'); }
        buffers.push(vertexBuffer, indexBuffer);
        gl!.bindBuffer(gl!.ARRAY_BUFFER, vertexBuffer);
        gl!.bufferData(gl!.ARRAY_BUFFER, vertices, gl!.STATIC_DRAW);
        const attribute = gl!.getAttribLocation(program!, 'a_uv');
        gl!.enableVertexAttribArray(attribute);
        gl!.vertexAttribPointer(attribute, 2, gl!.FLOAT, false, 0, 0);
        gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl!.bufferData(gl!.ELEMENT_ARRAY_BUFFER, indices, gl!.STATIC_DRAW);
        indexCount = indices.length;
        gl!.bindTexture(gl!.TEXTURE_2D, texture);
        gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false);
        // Match the browser compositor: filter colour already multiplied by alpha.
        // The cutout has vivid RGB in nearly transparent pixels. Straight-alpha
        // filtering/antialiasing can expose those colours around moving edges.
        gl!.pixelStorei(gl!.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
        // Normalise through the browser's premultiplied 2D surface before upload,
        // avoiding direct WebP-to-GPU alpha conversion differences on mobile.
        // No pixel readback or persistent copy is made.
        const source = document.createElement('canvas');
        source.width = photo!.naturalWidth; source.height = photo!.naturalHeight;
        const context = source.getContext('2d');
        if (!context) throw new Error('Texture surface unavailable');
        context.drawImage(photo!, 0, 0);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, source);
        source.width = 0; source.height = 0;
        gl!.uniform1i(gl!.getUniformLocation(program!, 'u_tree'), 0);
        time = gl!.getUniformLocation(program!, 'u_time');
        initialized = true;
        resize(); sync();
      } catch {
        setReady(false);
        cancelAnimationFrame(frame);
      }
    }
    function onLost(event: Event) { event.preventDefault(); lost = true; cancelAnimationFrame(frame); setReady(false); }
    function onRestored() { setContextVersion(value => value + 1); }
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    synchronize.current = sync;
    preference.addEventListener('change', sync);
    surface.addEventListener('webglcontextlost', onLost);
    surface.addEventListener('webglcontextrestored', onRestored);
    photo.addEventListener('load', initialize);
    if (photo.complete) initialize();
    return () => {
      disposed = true; cancelAnimationFrame(frame); synchronize.current = null;
      observer.disconnect(); preference.removeEventListener('change', sync);
      surface.removeEventListener('webglcontextlost', onLost);
      surface.removeEventListener('webglcontextrestored', onRestored);
      photo.removeEventListener('load', initialize);
      buffers.forEach(buffer => gl.deleteBuffer(buffer)); shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteTexture(texture); gl.deleteProgram(program);
    };
  }, [image, contextVersion]);

  return <canvas ref={canvas} className={`natural-tree-mesh${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
}
