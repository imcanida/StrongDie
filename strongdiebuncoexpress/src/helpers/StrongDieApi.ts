import { Api, JoinGameRequest } from "../api";

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

export const PromiseToJoinGame = async (request: JoinGameRequest) => {
  return StrongDieApi.gameJoinCreate(request)
    .then((response) => {
      return response?.data ?? response
    })
    .catch((error) => {
      return error
    })
}