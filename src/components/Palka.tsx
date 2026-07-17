type PalkaProps = {
    position: [number, number, number]
}

const Palka = ({ position }: PalkaProps) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.4, 2, 1]} />
            <pSXMaterial
                uResolution={160.0}
                uColor="red"
            />
        </mesh>
    )
}

export default Palka