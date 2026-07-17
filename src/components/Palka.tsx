import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { NearestFilter } from "three"
import type { Mesh } from "three"
import { gameState } from "../gameState"

type PalkaProps = {
    position: [number, number, number]
    keys: { up: string; down: string }
    side: "left" | "right"
}

const Palka = ({ position, keys, side }: PalkaProps) => {
    const meshRef = useRef<Mesh>(null)
    const pressed = useRef<Set<string>>(new Set())
    const speed = 5

    const texture = useTexture("/textures/paddle.jpg")
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter

    useEffect(() => {
        const onDown = (e: KeyboardEvent) => pressed.current.add(e.key)
        const onUp = (e: KeyboardEvent) => pressed.current.delete(e.key)
        window.addEventListener("keydown", onDown)
        window.addEventListener("keyup", onUp)
        return () => {
            window.removeEventListener("keydown", onDown)
            window.removeEventListener("keyup", onUp)
        }
    }, [])

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
        if (pressed.current.has(keys.up) && meshRef.current.position.y < 3) meshRef.current.position.y += speed * delta
        if (pressed.current.has(keys.down) && meshRef.current.position.y > -3) meshRef.current.position.y -= speed * delta
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