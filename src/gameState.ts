import type { Mesh } from "three"

export type ParticleEmission = {
    x: number
    y: number
    dirX: number  // general direction particles should fly
    dirY: number
    color: [number, number, number] // RGB 0-1
}

// Shared mutable game state (no React re-renders needed in the loop)
export const gameState = {
    playing: false,
    leftPaddle: null as Mesh | null,
    rightPaddle: null as Mesh | null,

    // Arena bounds (hardcoded for now, matches your existing clamp values)
    arenaTop: 3,
    arenaBottom: -3,
    arenaLeft: -6,
    arenaRight: 6,

    // Paddle half-height (boxGeometry args[1] / 2)
    paddleHalfHeight: 1,
    paddleHalfWidth: 0.2,

    // Particle emission queue — consumed each frame by Particles component
    particleEmissions: [] as ParticleEmission[],
}
