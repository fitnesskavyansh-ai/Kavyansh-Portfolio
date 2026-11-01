import * as THREE from 'three';

export const FireShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: null },
    uColor2: { value: null },
    uHeat: { value: 0.5 },
    uIntensity: { value: 1.0 },
    uExplosion: { value: 0.0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uHeat;
    uniform float uIntensity;
    uniform float uExplosion;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // Simplex noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw), 0.0), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      vec3 k0 = 0.85373472095314 - 0.59284591868602 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m.xyz, g);
    }

    // Domain warping fire
    float fbm(vec2 uv) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(uv);
        uv = uv * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      
      // Mouse influence - sway the fire toward mouse
      float mouseDist = distance(uv.x, uMouse.x);
      float sway = (uMouse.x - 0.5) * (1.0 - uv.y) * 0.5;
      uv.x -= sway * 0.5;

      // Domain warping for "licking" flames
      vec2 q = vec2(0.0);
      q.x = fbm(uv + vec2(0.0, uTime * 0.5));
      q.y = fbm(uv + vec2(1.0));

      vec2 r = vec2(0.0);
      r.x = fbm(uv + 1.0*q + vec2(1.7, 9.2) + 0.15*uTime);
      r.y = fbm(uv + 1.0*q + vec2(8.3, 2.8) + 0.126*uTime);

      float fire = fbm(uv + r);
      
      // Heat and Intensity layers
      fire += snoise(uv * 10.0 - vec2(0.0, uTime * 2.0)) * 0.2;
      
      // Shape the flame (rising up from bottom)
      float mask = 1.0 - smoothstep(0.0, 1.0, uv.y);
      // Horizontal containment
      mask *= smoothstep(0.0, 0.4, uv.x) * (1.0 - smoothstep(0.6, 1.0, uv.x));
      
      fire *= mask;
      
      // Color grading
      vec3 fireColor = mix(uColor2, uColor1, fire * uHeat * (1.0 + uExplosion * 3.0));
      fireColor += vec3(fire * 0.5 * uExplosion, fire * 0.2 * uExplosion, 0.0);
      
      // Intense core
      float core = smoothstep(0.5, 1.0, fire);
      fireColor = mix(fireColor, vec3(1.0, 0.9, 0.5), core * uHeat);

      gl_FragColor = vec4(fireColor * uIntensity, clamp(fire * uIntensity, 0.0, 1.0) * mask);
    }
  `
};

export const LightningShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#e50914') },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec2 x) {
      vec2 p = floor(x);
      vec2 f = fract(x);
      f = f*f*(3.0-2.0*f);
      float n = p.x + p.y*57.0;
      return mix(mix(hash(n+0.0), hash(n+1.0), f.x),
                 mix(hash(n+57.0), hash(n+58.0), f.x), f.y);
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 2.0;
      
      // Thin lightning bolt
      float bolt = abs(uv.x - 0.5 + (noise(vec2(uv.y * 10.0, t)) - 0.5) * 0.2);
      bolt = 0.002 / bolt;
      
      // Pulsing effect
      float pulse = step(0.9, fract(t * 0.5 + hash(floor(t))));
      
      gl_FragColor = vec4(uColor, bolt * pulse * (1.0 - uv.y));
    }
  `
};
