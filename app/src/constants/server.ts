
export const API_BASE_URL = import.meta.env.PROD ? "https://api.techify.ng" : "http://localhost:3000"
export const APP_BASE_URL = API_BASE_URL + "/app-v1"
export const SIM_BASE_URL = API_BASE_URL + "/sim-v1"
export const PAY_BASE_URL = API_BASE_URL + "/pay-v1"
export const MSN_BASE_URL = API_BASE_URL + "/msn-v1"
export const VTU_BASE_URL = API_BASE_URL + "/vtu-v1"
