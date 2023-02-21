import { useEffect, useContext } from 'react'
import { Player } from '../../api'
import { AppContext, AppContextDetails } from '../../context'


interface IRollDiceMessage {
  actor: Player
  diceRollResults: number[]
}

interface IUseSignalRGameHub {
  onDiceRolled?: (message: IRollDiceMessage) => void
  onJoinGame?: (message: Player) => void
  onLeaveGame?: (message: Player) => void
}

// TODO: Make it register callbacks for each event that is passed in, so it can work with multiple components.
const useSignalRGameHub = (options: IUseSignalRGameHub) => {
  const { isConnected, connection } = useContext<AppContextDetails>(AppContext)

  useEffect(() => {
    if (!options || !connection) return
    if (options?.onJoinGame) {
      connection.on('JoinGame', (message: Player) => {
        if (options?.onJoinGame) options.onJoinGame(message)
      })
    }

    if (options?.onLeaveGame) {
      connection.on('LeaveGame', (message: Player) => {
        if (options?.onLeaveGame) options.onLeaveGame(message)
      })
    }

    if (options.onDiceRolled) {
      connection.on('DiceRolled', (message: IRollDiceMessage) => {
        if (options?.onDiceRolled) options.onDiceRolled(message)
      })
    }

    return () => {
      if (options.onJoinGame) {
        connection.off('JoinGame')
      }

      if (options.onLeaveGame) {
        connection.off('LeaveGame')
      }

      if (options.onDiceRolled) {
        connection.off('DiceRolled')
      }
    }
  }, [options])

  return isConnected
}

export { useSignalRGameHub }
