import { Object3DNode } from '@react-three/fiber'
import { PSXMaterial } from './path-to-your-material' // Update this path if needed

// Augment the ThreeElements interface directly inside the R3F module
declare module '@react-three/fiber' {
  interface ThreeElements {
    pSXMaterial: Object3DNode<any, any>
    // Or for strict typing: 
    // pSXMaterial: Object3DNode<typeof PSXMaterial, typeof PSXMaterial>
  }
}