import { default as whatsapp } from "./whatsapp"
import { default as telegram } from "./telegram"
import type { Channel, Server } from "../../types/msn"

export const getServer = (index: Channel): Server => {
    if (index === "telegram")
    	return telegram
    return whatsapp
}

export const getWhatsApp = () => {
    return whatsapp
}

export const getTelegram = () => {
    return telegram
}
