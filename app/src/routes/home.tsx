import { Link } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
    return (
        <>
            <Link component={RouterLink} to={"/privacy-policy"}></Link>
        </>
    )
}