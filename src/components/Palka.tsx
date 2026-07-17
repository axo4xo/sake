import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

type PalkaProps = {
    position: [number, number, number]
    keys: { up: string; down: string }
}

const Palka = ({ position, keys }: PalkaProps) => {
    const meshRef = useRef<Mesh>(null)
    const pressed = useRef<Set<string>>(new Set())
    const speed = 5

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

    useFrame((_, delta) => {
        if (!meshRef.current) return
        if (pressed.current.has(keys.up) && meshRef.current.position.y < 3) meshRef.current.position.y += speed * delta
        if (pressed.current.has(keys.down) && meshRef.current.position.y > -3) meshRef.current.position.y -= speed * delta
    })

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.4, 2, 1]} />
            <pSXMaterial
                uResolution={160.0}
                uColor="red"
            />
        </mesh>
    )
}

export default Palka