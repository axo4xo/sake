import { useEffect, useRef, useState } from "react"

const FpsCounter = () => {
    const [visible, setVisible] = useState(false)
    const [fps, setFps] = useState(0)
    const frames = useRef(0)
    const lastTime = useRef(performance.now())

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === "KeyF" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                setVisible(v => !v)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    useEffect(() => {
        if (!visible) return

        let raf: number
        const tick = () => {
            frames.current++
            const now = performance.now()
            const elapsed = now - lastTime.current
            if (elapsed >= 500) {
                setFps(Math.round((frames.current * 1000) / elapsed))
                frames.current = 0
                lastTime.current = now
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [visible])

    if (!visible) return null

    return (
        <div style={{
            position: "fixed",
            top: 8,
            right: 12,
            color: "#0f0",
            fontFamily: "monospace",
            fontSize: 14,
            background: "rgba(0,0,0,0.6)",
            padding: "2px 8px",
            borderRadius: 4,
            zIndex: 9999,
            pointerEvents: "none",
            userSelect: "none",
        }}>
            {fps} FPS
        </div>
    )
}

export default FpsCounter
