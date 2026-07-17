import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Mesh } from "three"
import { gameState } from "../gameState"

const StartText = () => {
    const meshRef = useRef<Mesh>(null)

    useFrame(() => {
        if (!meshRef.current) return
        meshRef.current.visible = !gameState.playing
    })

    return (
        <Text
            ref={meshRef}
            position={[0, -2.5, 0.5]}
            fontSize={0.4}
            color="black"
            anchorX="center"
            anchorY="middle"

        >
            PRESS SPACE TO START
        </Text>
    )
}

export default StartText
