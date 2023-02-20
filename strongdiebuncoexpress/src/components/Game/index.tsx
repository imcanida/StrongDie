import { faDice, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Spinner } from 'reactstrap'
import { GameListDetail, LeaveGameRequest, LoadedDieSetting, Player, RollDiceRequest } from '../../api'
import { StrongDieApi } from '../../helpers/StrongDieApi'
import { FlexedDiv, StrongDieButton } from '../../helpers/Styles'
import { ILoadedDiceSettings } from '../../interfaces/ILoadedDiceSettings'
import { DieControl } from '../DieControl'
import { JoinGameModal } from '../JoinGameModal'
import { AppContext, AppContextDetails } from '../../context'
import { useOnFirstLoad } from '../../helpers/useFirstLoad'
import { GameListItem } from '../GameListItem'
import { useSignalRGameHub } from '../useSignalRGameHub'
import { toast } from 'react-toastify'

const Game = () => {
  // Using App Context State
  const { player, setPlayer } = useContext<AppContextDetails>(AppContext)

  // -- State Management --
  // Initial set of dice.
  const [diceValues, setDiceValues] = useState<ILoadedDiceSettings[]>([
    {
      shakeDie: false,
      dieValue: 1,
      loadedDie: {
        factor: 1,
        favor: 5,
        index: 0,
      },
    },
    {
      shakeDie: false,
      dieValue: 1,
      loadedDie: {
        factor: 1,
        favor: 5,
        index: 1,
      },
    },
  ])

  const [apiIsOffline, setApiIsOffline] = useState<boolean>(false)

  const [gameToJoin, setGameToJoin] = useState<GameListDetail>()
  const [gamesList, setGamesList] = useState<GameListDetail[]>([])
  const [loadGamesList, setLoadGamesList] = useState<boolean>(false)

  const [loadingDieRoll, setLoadingDieRoll] = useState<boolean>(false)
  const [animateRolls] = useState<boolean>(false) // Just playing with "animating the die"

  const indexOfGame = useCallback(
    (games: GameListDetail[]): number => {
      return games.findIndex((game) => game.players?.some((participant: Player) => participant.userName === player?.userName))
    },
    [player]
  )

  const loadGames = useCallback(() => {
    setLoadGamesList(true)
    return StrongDieApi.gameListCreate({})
      .then((response) => {
        const games = response?.data?.games
        setGamesList(response?.data?.games ?? [])
        // See if they are in a game.
        const playerGameIndex = indexOfGame(games ?? [])
        // No game found --
        if (playerGameIndex < 0) {
          setGameToJoin(undefined)
        } else if (games) {
          setGameToJoin(games[playerGameIndex])
        }
        setApiIsOffline(false)
        return response
      })
      .catch((error) => {
        setApiIsOffline(true)
        return error
      })
      .finally(() => {
        setLoadGamesList(false)
      })
  }, [indexOfGame])

  useEffect(() => {
    if (player && player.userName) {
      // See if they are in a game.
      const playerGameIndex = indexOfGame(gamesList ?? [])
      // No game found --
      if (playerGameIndex < 0) {
        setGameToJoin(undefined)
      } else if (gamesList) {
        setGameToJoin(gamesList[playerGameIndex])
      }
    }
  }, [gamesList, indexOfGame, player])

  const pingAPI = useCallback(() => {
    const playerObject = localStorage.getItem('player')
    if (playerObject) {
      setPlayer(JSON.parse(playerObject ?? ''))
    }
    setApiIsOffline(true)
    StrongDieApi.pingCreate()
      .then(() => {
        setApiIsOffline(false)
      })
      .catch(() => {
        setApiIsOffline(false)
      })
  }, [setPlayer])

  const rollDice = () => {
    const request: RollDiceRequest = {
      userID: player?.userID,
      userName: player?.userName,
      gameID: gameToJoin?.gameID,
      numberOfDiceToRoll: 2,
      loadedDiceSettings: diceValues.map((i) => i.loadedDie),
    }
    setLoadingDieRoll(true)
    // Can return the promise so any caller would receive the response.
    return StrongDieApi.actionsRollCreate(request)
      .then((response) => {
        if (response === null || response.data === null) return response
        const newDieValues = [...diceValues]
        const dieRollResults = response.data.dieRollResults ?? []
        for (let i = 0; i < dieRollResults.length; i++) {
          const rolledValue = dieRollResults[i]
          if (newDieValues.length > 0) {
            newDieValues[i].dieValue = rolledValue
          }
        }
        if (animateRolls) {
          setTimeout(() => {
            setLoadingDieRoll(false)
            setDiceValues(newDieValues)
          }, 1500)
        }
        return response
      })
      .catch((error) => {
        console.error(error)
        return error
      })
      .finally(() => {
        if (!animateRolls) {
          setLoadingDieRoll(false)
        }
      })
  }

  const leaveGame = () => {
    if (!gameToJoin?.gameID || !player?.userName) return
    const request: LeaveGameRequest = {
      userName: player?.userName,
      gameID: gameToJoin?.gameID,
    }
    return StrongDieApi.gameLeaveCreate(request)
      .then((response) => {
        // Send SignalR
        return response
      })
      .catch((error) => {
        return error
      })
      .finally(() => {
        setGameToJoin(undefined)
        loadGames()
      })
  }

  useOnFirstLoad(() => {
    pingAPI()
  })

  useOnFirstLoad(() => {
    loadGames()
  })

  // useSignalRGameHub callback registering
  useSignalRGameHub({
    // Not needed here.
    // onDiceRolled: (message) => {
    //   console.log(message)
    // },
    onJoinGame: (message) => {
      toast.success(`🦄 ${message.userName} Joined.`)
      loadGames()
    },
    onLeaveGame: (message) => {
      toast.success(`🦄 ${message.userName} Left.`)
      loadGames()
    },
  })

  return (
    <>
      {gameToJoin?.gameID && indexOfGame(gamesList) < 0 && (
        <>
          <JoinGameModal
            gameID={gameToJoin.gameID}
            loadGames={loadGames}
            onClosed={() => {
              setGameToJoin(undefined)
            }}
          />
        </>
      )}
      {loadGamesList ? (
        <Spinner />
      ) : (
        <>
          {player && gameToJoin ? (
            <>
              <GameListItem
                gameName={`Game #${gameToJoin.gameID}`}
                onLeave={() => {
                  leaveGame()
                }}
                players={gameToJoin.players ?? []}
              />
            </>
          ) : (
            <>
              {
                // false &&
                gamesList?.map((value, index) => {
                  return (
                    <GameListItem
                      gameName={`Game #${index}`}
                      key={`Game_List_Item_${index}`}
                      onJoin={() => {
                        setGameToJoin(value)
                      }}
                      players={value.players ?? []}
                    />
                  )
                })
              }
            </>
          )}
          {apiIsOffline && (
            <>
              <Alert>
                Dice Service are currently Offline!
                <div>
                  <StrongDieButton onClick={loadGames}>
                    <FontAwesomeIcon icon={faRefresh} /> Retry
                  </StrongDieButton>
                </div>
              </Alert>
            </>
          )}
          {apiIsOffline === false && (
            <>
              <FlexedDiv>
                <StrongDieButton disabled={loadingDieRoll} onClick={rollDice}>
                  Roll <FontAwesomeIcon icon={faDice} />
                </StrongDieButton>
              </FlexedDiv>
              <FlexedDiv>
                {diceValues.map((details, index) => {
                  return (
                    <DieControl
                      dieValue={details.dieValue}
                      key={`die_control_${index}`}
                      loadedDieSetting={details.loadedDie}
                      onUpdate={(newValue: LoadedDieSetting) => {
                        if (newValue) {
                          const diceValuesCopy = [...diceValues]
                          diceValuesCopy[index].loadedDie = newValue
                          setDiceValues(diceValuesCopy)
                        }
                      }}
                      roll={loadingDieRoll}
                    />
                  )
                })}
              </FlexedDiv>
            </>
          )}
        </>
      )}
    </>
  )
}

export { Game }
