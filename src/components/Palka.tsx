type PalkaProps = {
    position: [number, number, number]
}

const Palka = ({ position }: PalkaProps) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.4, 2, 1]} />
            <meshPhongMaterial />
        </mesh>
    )
}

export default Palka