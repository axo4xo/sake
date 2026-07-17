import { KeyboardControls } from "@react-three/drei"

export type Controls = "leftUp" | "leftDown" | "rightUp" | "rightDown" | "start"
export const keyMap = [
    { name: "leftUp", keys: ["KeyW"] },
    { name: "leftDown", keys: ["KeyS"] },
    { name: "rightUp", keys: ["ArrowUp"] },
    { name: "rightDown", keys: ["ArrowDown"] },
    { name: "start", keys: ["Space"] },
]

export { KeyboardControls }
