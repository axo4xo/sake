import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, RenderTexture } from "@react-three/drei"
import * as THREE from "three"
import type { Mesh } from "three"
import { gameState } from "../gameState"

const StartText = () => {
    const meshRef = useRef<Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.visible = !gameState.playing
        const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 4) * 0.15
        meshRef.current.scale.setScalar(pulse)
    })

    return (
        <mesh ref={meshRef} position={[0, -2.5, 0.5]}>
            <planeGeometry args={[8, 4]} />
            <meshBasicMaterial transparent>
                <RenderTexture
                    attach="map"
                    width={1024}
                    height={2048}
                    magFilter={THREE.NearestFilter}
                    minFilter={THREE.NearestFilter}
                >
                    <Text
                        fontSize={1}
                        color="white"
                        outlineColor="black"
                        outlineWidth={0.05}
                        fontWeight="bold"
                    >
                        PRESS SPACE TO START
                    </Text>
                </RenderTexture>
            </meshBasicMaterial>
        </mesh>
    )
}

export default StartText