import { Button } from "@mui/joy"
import { useCallback, useEffect } from "react"
import Swal from "sweetalert2"

import APPApi from "../../../modules/APPApi"

export default function VTUHomeRoot() {
    const onClick = useCallback(() => {
        APPApi.get().genKey("vtu").then(({ text }) => {
            Swal.fire("Success", text, "success")
        }).catch((err) => {
            Swal.fire("Error", err.getMessage(), "error")
        })
    }, [])
    useEffect(() => {

    }, [])
    return (
        <>
            <Button title="Generate Keys" onClick={onClick}>Generate Keys</Button>
        </>
    )
}