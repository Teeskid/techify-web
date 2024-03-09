import axios from "axios"

import { REQUEST_TIMEOUT } from "./const"

axios.defaults.timeout = REQUEST_TIMEOUT
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
