
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

const vertexShader = `
varying vec2 v_uv;

void main() {
     v_uv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_bg;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
varying vec2 v_uv;

// Noise functions
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }

float cnoise21(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
     Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
     gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
     g00 *= norm.x;
     g01 *= norm.y;
     g10 *= norm.z;
     g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
     return 2.3 * n_xy;
}

float random(vec2 p) {
  vec2 k1 = vec2(
     23.14069263277926, // e^pi (Gelfond's constant)
     2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
);
     return fract(
          cos(dot(p, k1)) * 12345.6789
     );
}

void main() {
  vec2 baseUv = v_uv * 1.5;
  // Add subtle movement based on mouse
  vec2 mouseEffect = u_mouse * 0.1;
     baseUv += mouseEffect;

  vec2 wave = vec2(
          sin(v_uv.y * 3.0 + u_time * 0.2) * 0.1,
          cos(v_uv.x * 3.0 + u_time * 0.15) * 0.1
     );

  vec2 seed1 = (baseUv + wave * 0.5) * 1.2;
  float n1_base = cnoise21(seed1 + u_time * 0.05);

  vec2 seed2 = (baseUv - wave) * 2.5;
  float n2_base = cnoise21(seed2 - u_time * 0.08) * 0.4;

  float n = n1_base + n2_base;

  // Vignette-like falloff
  // float dist = length(v_uv - 0.5);
  // n -= dist * 0.5;

  float n1 = smoothstep(-0.4, 0.2, n);
  vec3 color = mix(u_bg, u_color1, n1);

  float n2 = smoothstep(0.1, 0.4, n);
     color = mix(color, u_color2, n2);

  float n3 = smoothstep(0.3, 0.6, n);
     color = mix(color, u_color3, n3);

  // Add noise grain
  vec2 uvrandom = v_uv + u_time * 0.1;
     color.rgb += random(uvrandom) * 0.04;

     gl_FragColor = vec4(color, 1.0);
}
`;

const FluidPlane = () => {
     const mesh = useRef<THREE.Mesh>(null);
     const { viewport } = useThree();
     const { resolvedTheme } = useTheme();

     const uniforms = useMemo(
          () => ({
               u_time: { value: 0 },
               u_mouse: { value: new THREE.Vector2() },
               u_bg: { value: new THREE.Color('#000000') },
               u_color1: { value: new THREE.Color('#000000') },
               u_color2: { value: new THREE.Color('#000000') },
               u_color3: { value: new THREE.Color('#000000') },
          }),
          []
     );

     // Target colors based on theme
     const targetColors = useMemo(() => {
          const isDark = resolvedTheme === 'dark';
          return {
               bg: new THREE.Color(isDark ? '#050505' : '#ffffff'),
               c1: new THREE.Color(isDark ? '#1a1a1a' : '#f0f0f0'),
               c2: new THREE.Color(isDark ? '#2a2a2a' : '#e0e0e0'),
               c3: new THREE.Color(isDark ? '#404040' : '#d0d0d0'),
          };
     }, [resolvedTheme]);

     useFrame((state) => {
          const { clock } = state;
          if (mesh.current) {
               const material = mesh.current.material as THREE.ShaderMaterial;
               material.uniforms.u_time.value = clock.getElapsedTime();

               // Smoothly interpolate mouse values
               material.uniforms.u_mouse.value.lerp(
                    new THREE.Vector2(state.pointer.x, state.pointer.y),
                    0.05
               );

               // Smoothly interpolate colors
               material.uniforms.u_bg.value.lerp(targetColors.bg, 0.05);
               material.uniforms.u_color1.value.lerp(targetColors.c1, 0.05);
               material.uniforms.u_color2.value.lerp(targetColors.c2, 0.05);
               material.uniforms.u_color3.value.lerp(targetColors.c3, 0.05);
          }
     });

     return (
          <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
               <planeGeometry args={[1, 1]} />
               <shaderMaterial
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniforms}
               />
          </mesh>
     );
};

export default function FluidBackground() {
     return (
          <div className="fixed inset-0 pointer-events-none -z-10">
               <Canvas
                    camera={{ position: [0, 0, 1] }}
                    dpr={[1, 2]} // Lower DPR for performance if needed
               >
                    <FluidPlane />
               </Canvas>
          </div>
     );
}

