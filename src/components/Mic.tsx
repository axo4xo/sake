import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls, useTexture, PositionalAudio } from "@react-three/drei"
import { NearestFilter } from "three"
import * as THREE from "three"
import type { Mesh } from "three"
import { gameState } from "../gameState"
import type { Controls } from "../controls"

const BALL_SPEED = 6
const BALL_RADIUS = 0.25

const Mic = () => {
    const meshRef = useRef<Mesh>(null)
    const audioRef = useRef<THREE.PositionalAudio>(null)
    const velocity = useRef({ x: 0, y: 0 })
    const prevStart = useRef(false)
    const [, get] = useKeyboardControls<Controls>()

    const texture = useTexture("/textures/ball.jpg")
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter

    const playPing = () => {
        const audio = audioRef.current

        if (!audio || !audio.buffer) return
        audio.setVolume(0.4)

        const context = audio.context
        const source = context.createBufferSource()
        source.buffer = audio.buffer
        source.playbackRate.value = 0.85 + Math.random() * 0.3

        const targetNode = audio.panner || audio.getOutput()
        source.connect(targetNode)

        source.start(0)
    }

    useFrame((_, delta) => {
        if (!meshRef.current) return

        const { start } = get()
        if (start && !prevStart.current && !gameState.playing) {
            gameState.playing = true
            meshRef.current.position.set(0, 0, 0)

            const angle = (Math.random() - 0.5) * Math.PI * 0.5
            const dir = Math.random() > 0.5 ? 1 : -1
            velocity.current.x = Math.cos(angle) * BALL_SPEED * dir
            velocity.current.y = Math.sin(angle) * BALL_SPEED
        }
        prevStart.current = start

        if (!gameState.playing) return

        const pos = meshRef.current.position
        const vel = velocity.current

        pos.x += vel.x * delta
        pos.y += vel.y * delta

        const { arenaTop, arenaBottom, leftPaddle, rightPaddle, paddleHalfHeight, paddleHalfWidth } = gameState

        // Odraz nahoře
        if (pos.y + BALL_RADIUS > arenaTop) {
            pos.y = arenaTop - BALL_RADIUS
            vel.y = -Math.abs(vel.y)
            playPing()
            gameState.particleEmissions.push({ x: pos.x, y: arenaTop, dirX: 0, dirY: -1, color: [1, 1, 1] })
        }
        // Odraz dole
        if (pos.y - BALL_RADIUS < arenaBottom) {
            pos.y = arenaBottom + BALL_RADIUS
            vel.y = Math.abs(vel.y)
            playPing()
            gameState.particleEmissions.push({ x: pos.x, y: arenaBottom, dirX: 0, dirY: 1, color: [1, 1, 1] })
        }

        // Levá pálka
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
                const offset = (pos.y - py) / paddleHalfHeight
                vel.y = offset * BALL_SPEED * 0.75
                playPing()
                gameState.particleEmissions.push({ x: pos.x, y: pos.y, dirX: 1, dirY: offset, color: [1, 0.5, 0.1] })
            }
        }

        // Pravá pálka
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
                playPing()
                gameState.particleEmissions.push({ x: pos.x, y: pos.y, dirX: -1, dirY: offset, color: [1, 0.5, 0.1] })
            }
        }

        const rot = meshRef.current.rotation
        rot.y -= vel.x * delta / BALL_RADIUS
        rot.x -= vel.y * delta / BALL_RADIUS

        const { arenaLeft, arenaRight } = gameState
        if (pos.x < arenaLeft || pos.x > arenaRight) {
            gameState.playing = false
            pos.set(0, 0, 0)
            vel.x = 0
            vel.y = 0
            rot.set(0, 0, 0)
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
            <PositionalAudio
                ref={audioRef}
                url="/ping.mp3"
                loop={false}
                distance={5}

            />
        </mesh>
    )
}

export default Mic