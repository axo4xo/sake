import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { gameState } from "../gameState"

const MAX_PARTICLES = 200
const PARTICLES_PER_BURST = 12
const PARTICLE_LIFE = 0.6
const PARTICLE_SPEED = 8
const PARTICLE_SIZE = 0.06
const GRAVITY = -12

type Particle = {
    alive: boolean
    life: number
    maxLife: number
    x: number
    y: number
    z: number
    vx: number
    vy: number
    vz: number
    r: number
    g: number
    b: number
}

const Particles = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const color = useMemo(() => new THREE.Color(), [])

    const particles = useRef<Particle[]>(
        Array.from({ length: MAX_PARTICLES }, () => ({
            alive: false,
            life: 0,
            maxLife: PARTICLE_LIFE,
            x: 0, y: 0, z: 0,
            vx: 0, vy: 0, vz: 0,
            r: 1, g: 1, b: 1,
        }))
    )

    const nextIndex = useRef(0)

    const emit = (x: number, y: number, dirX: number, dirY: number, col: [number, number, number]) => {
        const pool = particles.current
        for (let i = 0; i < PARTICLES_PER_BURST; i++) {
            const p = pool[nextIndex.current]
            nextIndex.current = (nextIndex.current + 1) % MAX_PARTICLES

            p.alive = true
            p.life = PARTICLE_LIFE * (0.5 + Math.random() * 0.5)
            p.maxLife = p.life
            p.x = x
            p.y = y
            p.z = 0.1

            // Spread around the general direction
            const spread = (Math.random() - 0.5) * 2.5
            const speed = PARTICLE_SPEED * (0.3 + Math.random() * 0.7)
            p.vx = (dirX + spread * -dirY) * speed * 0.5
            p.vy = (dirY + spread * dirX) * speed * 0.5
            p.vz = (Math.random() - 0.3) * speed * 0.3

            // Slight color variation
            p.r = col[0] * (0.8 + Math.random() * 0.2)
            p.g = col[1] * (0.7 + Math.random() * 0.3)
            p.b = col[2] * (0.7 + Math.random() * 0.3)
        }
    }

    useFrame((_, delta) => {
        if (!meshRef.current) return

        // Process emission queue
        const emissions = gameState.particleEmissions
        while (emissions.length > 0) {
            const e = emissions.pop()!
            emit(e.x, e.y, e.dirX, e.dirY, e.color)
        }

        // Update particles
        const pool = particles.current
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = pool[i]

            if (p.alive) {
                p.life -= delta
                if (p.life <= 0) {
                    p.alive = false
                }

                p.vy += GRAVITY * delta
                p.x += p.vx * delta
                p.y += p.vy * delta
                p.z += p.vz * delta

                const t = p.life / p.maxLife // 1 → 0
                const scale = PARTICLE_SIZE * t

                dummy.position.set(p.x, p.y, p.z)
                dummy.scale.setScalar(scale)
                dummy.updateMatrix()
                meshRef.current!.setMatrixAt(i, dummy.matrix)

                color.setRGB(p.r * t, p.g * t, p.b * t)
                meshRef.current!.setColorAt(i, color)
            } else {
                // Hide dead particles
                dummy.position.set(0, 0, -100)
                dummy.scale.setScalar(0)
                dummy.updateMatrix()
                meshRef.current!.setMatrixAt(i, dummy.matrix)
            }
        }

        meshRef.current.instanceMatrix.needsUpdate = true
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true
        }
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    )
}

export default Particles
