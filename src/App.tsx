import "./components/PSXMaterial"
import { Canvas } from "@react-three/fiber"
import { KeyboardControls } from "@react-three/drei"
import { keyMap } from "./controls"
import Palka from "./components/Palka";
import Mic from "./components/Mic";
import StartText from "./components/StartText";
import Arena from "./components/Arena";
import Particles from "./components/Particles";
import FpsCounter from "./components/FpsCounter";
import GameMusic from "./components/GameMusic";

const App = () => {
  return (
    <KeyboardControls map={keyMap}>
      <div id="canvas-container">
        <FpsCounter />
        <Canvas
          gl={{ antialias: false, desynchronized: true, powerPreference: "high-performance" }}
          dpr={[0.1, 0.3]}
          style={{ imageRendering: 'pixelated' }}>

          <Palka position={[-5, 0, 0]} upControl="leftUp" downControl="leftDown" side="left" />
          <Palka position={[5, 0, 0]} upControl="rightUp" downControl="rightDown" side="right" />
          <Mic />
          <StartText />
          <Arena />
          <Particles />
          <GameMusic />

          <ambientLight intensity={0.6} />
          <directionalLight color="white" position={[0, 0, 1]} intensity={1} />

        </Canvas>
      </div>
    </KeyboardControls>
  )
}

export default App;
