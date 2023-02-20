import * as signalR from '@microsoft/signalr'
import { createContext, useState } from 'react'
import { GameListDetail, Player } from './api'
import { useOnFirstLoad } from './helpers/useFirstLoad'

export interface AppContextDetails {
  player?: Player
  setPlayer: (player?: Player) => void
  getPlayer: () => Player | undefined
  game?: GameListDetail
  setGame: (game?: GameListDetail) => void
  getGame: () => GameListDetail | undefined
  connection: signalR.HubConnection | undefined
  isConnected: boolean
}

export const AppContext = createContext<AppContextDetails>({} as AppContextDetails)
export const GameHubUrl = 'https://localhost:7259/gameHub'
export const AppContextProvider = ({ children }: any) => {
  const [connection, setConnection] = useState<signalR.HubConnection>()
  const [isConnected, setIsConnected] = useState(false)
  const [player, setPlayerState] = useState<Player | undefined>(undefined)
  const [game, setGameState] = useState<GameListDetail | undefined>(undefined)

  const setPlayer = (newPlayer?: Player) => {
    setPlayerState(newPlayer)
    if (newPlayer) {
      setLocalPlayer(newPlayer)
    } else {
      localStorage.removeItem('localPlayer')
    }
  }

  const getPlayer = (): Player | undefined => {
    const player = localStorage.getItem('localPlayer')
    if (player) {
      return JSON.parse(player)
    }
    return undefined
  }

  const setLocalPlayer = (player: Player) => {
    localStorage.setItem('localPlayer', JSON.stringify(player))
  }

  const setGame = (game?: GameListDetail) => {
    setGameState(game)
    if (game) {
      setLocalGame(game)
    } else {
      localStorage.removeItem('localGame')
    }
  }

  const getGame = (): GameListDetail | undefined => {
    const game = localStorage.getItem('localGame')
    if (game) {
      return JSON.parse(game)
    }
    return undefined
  }

  const setLocalGame = (game: GameListDetail) => {
    localStorage.setItem('localGame', JSON.stringify(game))
  }

  useOnFirstLoad(() => {
    setPlayer(getPlayer())
    setGame(getGame())
  })

  useOnFirstLoad(() => {
    let newConnection: signalR.HubConnection | undefined
    if (!isConnected) {
      newConnection = new signalR.HubConnectionBuilder().withUrl(GameHubUrl).withAutomaticReconnect().build()
      setConnection(newConnection)
      newConnection
        .start()
        .then(() => {
          console.log('SignalR GameHub Connection established')
          setIsConnected(true)
        })
        .catch((error) => {
          console.log('SignalR GameHub Connection error: ', error)
        })
    }
    return () => {
      if (newConnection) {
        try {
          newConnection.stop()
          setIsConnected(false)
        } catch (e) {
          console.log('Error stopping SignalR GameHub Connection: ', e)
        }
      }
    }
  })

  return <AppContext.Provider value={{ player, setPlayer, getPlayer, game, setGame, getGame, connection, isConnected }}>{children}</AppContext.Provider>
}
