// Single global keyboard state — one listener pair for the entire game.
// Read from useFrame via keyboard.pressed("w"), no React re-renders.

const keys = new Set<string>()

// Track keys that were just pressed this frame (for one-shot actions like Space)
const justPressed = new Set<string>()
const processed = new Set<string>()

window.addEventListener("keydown", (e) => {
    keys.add(e.key)
    if (!processed.has(e.key)) {
        justPressed.add(e.key)
        processed.add(e.key)
    }
    // Also track by code for keys like Space
    keys.add(e.code)
    if (!processed.has(e.code)) {
        justPressed.add(e.code)
        processed.add(e.code)
    }
})

window.addEventListener("keyup", (e) => {
    keys.delete(e.key)
    keys.delete(e.code)
    processed.delete(e.key)
    processed.delete(e.code)
})

export const keyboard = {
    /** Is the key currently held down? Use in useFrame for continuous input. */
    held: (key: string) => keys.has(key),

    /** Was the key just pressed this frame? Auto-clears after consumption. */
    justPressed: (key: string) => {
        if (justPressed.has(key)) {
            justPressed.delete(key)
            return true
        }
        return false
    },

    /** Call once per frame to clean up stale justPressed keys (optional safety net). */
    flushFrame: () => {
        justPressed.clear()
    },
}
