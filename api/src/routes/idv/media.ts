/** @module routes/idv/media */

import { Router as createRouter } from "express";
import { getStorage } from "firebase-admin/storage";

const media = createRouter()

media.get("/photo", async (r, res) => {
    try {
        const { id } = r.query
        const media = getStorage().bucket().file(`cache/${id}`)
        const stream = media.createReadStream()
        res.send(stream)
    } catch (error: Error | unknown) {
        console.error(error)
        res.sendStatus(500)
    }
})

export default media
