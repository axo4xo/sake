import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// 1. Create a 1x1 solid white DataTexture
const defaultWhiteTexture = new THREE.DataTexture(
  new Uint8Array([255, 255, 255, 255]),
  1,
  1
)
defaultWhiteTexture.needsUpdate = true

const PSXMaterial = shaderMaterial(
  {
    // 2. Set it as the default fallback
    uTexture: defaultWhiteTexture,
    uResolution: 160.0,
    uColor: new THREE.Color("white")
  },
  `
    varying vec2 vUv;
    uniform float uResolution;

    void main() {
      vUv = uv;
      vec4 snapToPixel = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 vertex = snapToPixel;
      vertex.xyz = snapToPixel.xyz / snapToPixel.w;
      vertex.x = floor(uResolution * vertex.x) / uResolution;
      vertex.y = floor(uResolution * vertex.y) / uResolution;
      vertex.xyz *= snapToPixel.w;
      gl_Position = vertex;
    }
  `,
  `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      gl_FragColor = vec4(texColor.rgb * uColor, texColor.a);
    }
  `
)

extend({ PSXMaterial })