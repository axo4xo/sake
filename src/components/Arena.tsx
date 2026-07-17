import { useTexture } from "@react-three/drei"
import { NearestFilter, RepeatWrapping } from "three"

const Arena = () => {
    const texture = useTexture("/textures/floor.jpg")
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(20, 20)

    return (
        <mesh position={[0, 0, -0.5]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}

export default Arena
