import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Root(): React.ReactNode {
    useEffect(() => {
    }, [])
    return (
        <>
            <header></header>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </>
    )
}
