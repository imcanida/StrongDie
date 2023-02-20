import * as signalR from '@microsoft/signalr'
import { createContext, useEffect, useState } from 'react'
import { Player } from './api'
import { useOnFirstLoad } from './helpers/useFirstLoad'

export interface AppContextDetails {
  player?: Player
  setPlayer: (player?: Player) => void
  getPlayer: () => Player | undefined
  connection: signalR.HubConnection | undefined
  isConnected: boolean
}

export const AppContext = createContext<AppContextDetails>({} as AppContextDetails)
export const GameHubUrl = 'https://localhost:7259/gameHub'
export const AppContextProvider = ({ children }: any) => {
  const [connection, setConnection] = useState<signalR.HubConnection>()
  const [isConnected, setIsConnected] = useState(false)
  const [player, setPlayerState] = useState<Player | undefined>(undefined)
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

  useOnFirstLoad(() => {
    setPlayer(getPlayer())
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

  return <AppContext.Provider value={{ player, setPlayer, getPlayer, connection, isConnected }}>{children}</AppContext.Provider>
}
