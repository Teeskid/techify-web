import { useContext } from "react";

import AccountContext from "./AccountContext";

export default function useAccount() {
    return useContext(AccountContext)
}
