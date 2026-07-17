import { KeyboardControls } from "@react-three/drei"

export enum Controls {
    leftUp = "leftUp",
    leftDown = "leftDown",
    rightUp = "rightUp",
    rightDown = "rightDown",
    start = "start",
}

export const keyMap = [
    { name: Controls.leftUp, keys: ["KeyW"] },
    { name: Controls.leftDown, keys: ["KeyS"] },
    { name: Controls.rightUp, keys: ["ArrowUp"] },
    { name: Controls.rightDown, keys: ["ArrowDown"] },
    { name: Controls.start, keys: ["Space"] },
]

export { KeyboardControls }
