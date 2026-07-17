import { useEffect, useRef } from "react"
import { PositionalAudio } from "@react-three/drei"
import type { PositionalAudio as PositionalAudioImpl } from "three"

const MUSIC_SRC = "/pongcompressed.mp3"
const MUSIC_VOLUME = 0.33
const MUSIC_REF_DISTANCE = 20

const GameMusic = () => {
    const musicRef = useRef<PositionalAudioImpl>(null)

    useEffect(() => {
        const mountedMusic = musicRef.current

        const playMusic = async () => {
            const music = musicRef.current
            if (!music || !music.buffer || music.isPlaying) return

            music.setVolume(MUSIC_VOLUME)

            if (music.context.state === "suspended") {
                await music.context.resume()
            }

            if (!music.isPlaying) {
                music.play()
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                void playMusic()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            if (mountedMusic?.isPlaying) {
                mountedMusic.stop()
            }
        }
    }, [])

    return (
        <PositionalAudio
            ref={musicRef}
            url={MUSIC_SRC}
            loop
            distance={MUSIC_REF_DISTANCE}
            position={[0, 0, 0]}
        />
    )
}

export default GameMusic
