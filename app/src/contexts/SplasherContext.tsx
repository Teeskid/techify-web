import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

type SplasherContextProps = {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>
}

const SplasherContext = createContext<SplasherContextProps>({} as SplasherContextProps);

type SplasherProviderProps = {
    children?: ReactNode
}

export const SplasherProvider = ({ children }: SplasherProviderProps): JSX.Element => {
    const [show, setShow] = useState(false) as [boolean, Dispatch<SetStateAction<boolean>>]
    return (
        <SplasherContext.Provider value={{ show, setShow }}>
            {children}
        </SplasherContext.Provider>
    )
}

export default SplasherContext