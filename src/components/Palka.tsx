import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls, useTexture } from "@react-three/drei"
import { NearestFilter } from "three"
import type { Mesh } from "three"
import { gameState } from "../gameState"

type PalkaProps = {
    position: [number, number, number]
    upControl: string
    downControl: string
    side: "left" | "right"
}

const Palka = ({ position, upControl, downControl, side }: PalkaProps) => {
    const meshRef = useRef<Mesh>(null)
    const speed = 5
    const [, get] = useKeyboardControls()

    const texture = useTexture("/textures/paddle.jpg")
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter

    // Register mesh ref in shared game state
    useEffect(() => {
        if (meshRef.current) {
            if (side === "left") gameState.leftPaddle = meshRef.current
            else gameState.rightPaddle = meshRef.current
        }
        return () => {
            if (side === "left") gameState.leftPaddle = null
            else gameState.rightPaddle = null
        }
    }, [side])

    useFrame((_, delta) => {
        if (!meshRef.current) return
        const state = get() as Record<string, boolean>
        if (state[upControl] && meshRef.current.position.y < 3) meshRef.current.position.y += speed * delta
        if (state[downControl] && meshRef.current.position.y > -3) meshRef.current.position.y -= speed * delta
    })

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.4, 2, 0.5]} />
            <pSXMaterial
                uResolution={160.0}
                uColor="white"
                uTexture={texture}
            />
        </mesh>
    )
}

export default Palka