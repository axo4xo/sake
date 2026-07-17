import "./components/PSXMaterial"
import { Canvas } from "@react-three/fiber"
import Palka from "./components/Palka";
import Mic from "./components/Mic";
import StartText from "./components/StartText";

const App = () => {
  return (
    <div id="canvas-container">
      <Canvas
        dpr={[0.1, 0.3]}
        style={{ imageRendering: 'pixelated' }}>

        <Palka position={[-5, 0, 0]} keys={{ up: "w", down: "s" }} side="left" />
        <Palka position={[5, 0, 0]} keys={{ up: "ArrowUp", down: "ArrowDown" }} side="right" />
        <Mic />
        <StartText />

        <ambientLight intensity={0} />
        <directionalLight color="red" position={[0, 0, 1]} />

      </Canvas>
    </div>
  )
}

export default App;