const Mic = () => {
    return (
        <mesh>
            <sphereGeometry args={[0.25]} />
            <pSXMaterial
                uResolution={320.0}
                uColor="blue"
            />
        </mesh>
    )
}

export default Mic