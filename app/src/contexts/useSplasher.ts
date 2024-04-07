import { useContext } from "react"

import SplasherContext from "./SplasherContext"

export default function useSplasher() {
    return useContext(SplasherContext)
}