import { Api } from "../api";

/**
 * Little wrapper around the generate api
 * */
const backendBaseUrl = 'https://localhost:7259'
export const gateWay = new Api({
  baseURL: backendBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const StrongDieApi = gateWay.api