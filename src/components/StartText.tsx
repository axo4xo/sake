import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, RenderTexture, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import type { Mesh } from "three"
import { gameState } from "../gameState"

// Camera-space offset: pins the text to the screen (lower middle) like a HUD
// element instead of standing on the table in the world.
const HUD_OFFSET = new THREE.Vector3(0, -1.5, -20)

const StartText = () => {
    const meshRef = useRef<Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.visible = !gameState.playing
        const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 4) * 0.15
        meshRef.current.scale.setScalar(pulse)
        meshRef.current.quaternion.copy(state.camera.quaternion)
        meshRef.current.position
            .copy(HUD_OFFSET)
            .applyQuaternion(state.camera.quaternion)
            .add(state.camera.position)
    })

    return (
        <mesh ref={meshRef} renderOrder={999}>
            <planeGeometry args={[8, 4]} />
            <meshBasicMaterial transparent depthTest={false} depthWrite={false}>
                <RenderTexture
                    attach="map"
                    width={1024}
                    height={2048}
                    magFilter={THREE.NearestFilter}
                    minFilter={THREE.NearestFilter}
                >
                    {/* Own camera so the texture is independent of the game camera.
                        manual + aspect=2 (the plane's 8:4 aspect) keeps the glyphs
                        undistorted regardless of window size. */}
                    <PerspectiveCamera makeDefault manual aspect={2} position={[0, 0, 5]} fov={75} />
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