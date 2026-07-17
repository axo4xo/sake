import "./components/PSXMaterial"
import { useLayoutEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { MathUtils } from "three"
import { KeyboardControls } from "@react-three/drei"
import { keyMap } from "./controls"
import Palka from "./components/Palka";
import Mic from "./components/Mic";
import StartText from "./components/StartText";
import Arena from "./components/Arena";
import Particles from "./components/Particles";
import FpsCounter from "./components/FpsCounter";
import GameMusic from "./components/GameMusic";

// Floating camera: far from the table with a narrow fov, so perspective is
// flattened but still angled (not quite bird's eye). Aims a bit below arena
// center so the near (bottom) and far (top) paddle extremes keep equal margins.
const CAMERA_POSITION: [number, number, number] = [0, -12, 16]
const CAMERA_TARGET_Y = -0.5
const CAMERA_TILT = Math.atan2(CAMERA_TARGET_Y - CAMERA_POSITION[1], CAMERA_POSITION[2])
const CAMERA_FOV = 20
// Below this window aspect the fov widens to keep the same horizontal
// coverage, so the paddles never slide out of a narrow frame.
const CAMERA_MIN_ASPECT = 1.9

const AdaptiveFov = () => {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.viewport.aspect)
  useLayoutEffect(() => {
    if (!("fov" in camera)) return
    const halfTan = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2))
    camera.fov = aspect >= CAMERA_MIN_ASPECT
      ? CAMERA_FOV
      : MathUtils.radToDeg(2 * Math.atan(halfTan * (CAMERA_MIN_ASPECT / aspect)))
    camera.updateProjectionMatrix()
  }, [camera, aspect])
  return null
}

const App = () => {
  return (
    <KeyboardControls map={keyMap}>
      <div id="canvas-container">
        <FpsCounter />
        <Canvas
          gl={{ antialias: false }}
          dpr={[0.1, 0.3]}
          camera={{ position: CAMERA_POSITION, rotation: [CAMERA_TILT, 0, 0], fov: CAMERA_FOV }}
          style={{ imageRendering: 'pixelated' }}>

          <AdaptiveFov />
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
