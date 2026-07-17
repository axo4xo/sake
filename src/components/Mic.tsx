import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { NearestFilter } from "three"
import type { Mesh } from "three"
import { gameState } from "../gameState"

const BALL_SPEED = 6
const BALL_RADIUS = 0.25

const Mic = () => {
    const meshRef = useRef<Mesh>(null)
    const velocity = useRef({ x: 0, y: 0 })

    const texture = useTexture("/textures/ball.jpg")
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter

    // Listen for Space to start/reset
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === "Space" && !gameState.playing) {
                e.preventDefault()
                gameState.playing = true

                if (meshRef.current) {
                    meshRef.current.position.set(0, 0, 0)
                }

                const angle = (Math.random() - 0.5) * Math.PI * 0.5 // -45° to +45°
                const dir = Math.random() > 0.5 ? 1 : -1
                velocity.current.x = Math.cos(angle) * BALL_SPEED * dir
                velocity.current.y = Math.sin(angle) * BALL_SPEED
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    useFrame((_, delta) => {
        if (!meshRef.current || !gameState.playing) return

        const pos = meshRef.current.position
        const vel = velocity.current

        // Move
        pos.x += vel.x * delta
        pos.y += vel.y * delta

        // Top/bottom wall bounce
        const { arenaTop, arenaBottom } = gameState
        if (pos.y + BALL_RADIUS > arenaTop) {
            pos.y = arenaTop - BALL_RADIUS
            vel.y = -Math.abs(vel.y)
        }
        if (pos.y - BALL_RADIUS < arenaBottom) {
            pos.y = arenaBottom + BALL_RADIUS
            vel.y = Math.abs(vel.y)
        }

        // Paddle collision
        const { leftPaddle, rightPaddle, paddleHalfHeight, paddleHalfWidth } = gameState

        // Left paddle
        if (leftPaddle && vel.x < 0) {
            const px = leftPaddle.position.x
            const py = leftPaddle.position.y
            if (
                pos.x - BALL_RADIUS <= px + paddleHalfWidth &&
                pos.x + BALL_RADIUS >= px - paddleHalfWidth &&
                pos.y >= py - paddleHalfHeight &&
                pos.y <= py + paddleHalfHeight
            ) {
                pos.x = px + paddleHalfWidth + BALL_RADIUS
                vel.x = Math.abs(vel.x)
                const offset = (pos.y - py) / paddleHalfHeight // -1 to 1
                vel.y = offset * BALL_SPEED * 0.75
            }
        }

        if (rightPaddle && vel.x > 0) {
            const px = rightPaddle.position.x
            const py = rightPaddle.position.y
            if (
                pos.x + BALL_RADIUS >= px - paddleHalfWidth &&
                pos.x - BALL_RADIUS <= px + paddleHalfWidth &&
                pos.y >= py - paddleHalfHeight &&
                pos.y <= py + paddleHalfHeight
            ) {
                pos.x = px - paddleHalfWidth - BALL_RADIUS
                vel.x = -Math.abs(vel.x)
                const offset = (pos.y - py) / paddleHalfHeight
                vel.y = offset * BALL_SPEED * 0.75
            }
        }

        const { arenaLeft, arenaRight } = gameState
        if (pos.x < arenaLeft || pos.x > arenaRight) {
            gameState.playing = false
            pos.set(0, 0, 0)
            vel.x = 0
            vel.y = 0
        }
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[BALL_RADIUS]} />
            <pSXMaterial
                uResolution={320.0}
                uColor="white"
                uTexture={texture}
            />
        </mesh>
    )
}

export default Mic