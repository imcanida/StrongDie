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

const Game = () => {
  // Using App Context State
  const { player, game, setGame } = useContext<AppContextDetails>(AppContext)
  const [participant, setParticipant] = useState<Player | undefined>()
  // -- State Management --
  // Moving this over from GameListItem so it can hold the state of the dice between leaves/joins.
  const [activePlayerDiceRolls, setActivePlayerDiceRolls] = useState<{ [key: string]: number[] }>({})

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

  const loadGames = () => {
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
  }

  useEffect(() => {
    if (player && player.userName) {
      // See if they are in a game.
      const playerGameIndex = indexOfGame(gamesList ?? [])
      // No game found --
      if (playerGameIndex < 0) {
        setGame(undefined)
      } else if (gamesList) {
        setGame(gamesList[playerGameIndex])
      }
    }
  }, [gamesList, indexOfGame, player])

  const pingAPI = useCallback(() => {
    setApiIsOffline(true)
    StrongDieApi.pingCreate()
      .then(() => {
        setApiIsOffline(false)
      })
      .catch(() => {
        setApiIsOffline(false)
      })
  }, [])

  const rollDice = () => {
    const request: RollDiceRequest = {
      userID: player?.userID,
      userName: player?.userName,
      gameID: game?.gameID,
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
    if (!game?.gameID || !player?.userName) return
    const request: LeaveGameRequest = {
      userName: player?.userName,
      gameID: game?.gameID,
    }
    return StrongDieApi.gameLeaveCreate(request)
      .then((response) => {
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

  const onGameSelected = (value: GameListDetail) => {
    setParticipant(player)
    setGameToJoin(value)
  }

  // -- Watcher when the player is changed to undefined (logout) -- leave the game as well.
  useEffect(() => {
    if (!player) {
      leaveGame()?.then(() => {
        loadGames()
      })
    }
  }, [player, participant])

  useOnFirstLoad(() => {
    pingAPI()
  })

  useOnFirstLoad(() => {
    setParticipant(player)
    loadGames()
  })

  // useSignalRGameHub callback registering
  useSignalRGameHub({
    onJoinGame: () => {
      loadGames()
    },
    onLeaveGame: () => {
      loadGames()
    },
    onDiceRolled: (message) => {
      // Update activePlayerDiceRolls roll by username
      if (!message?.actor?.userName) return
      const copy = { ...activePlayerDiceRolls }
      copy[message?.actor?.userName] = message.diceRollResults
      setActivePlayerDiceRolls(copy)
    },
  })

  return (
    <>
      {loadGamesList && <Spinner />}
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
      <>
        {player && game ? (
          <>
            <GameListItem
              activePlayerDiceRolls={activePlayerDiceRolls ?? {}}
              gameName={`Game #${game.gameID}`}
              onLeave={() => {
                leaveGame()
              }}
              players={game.players ?? []}
            />
          </>
        ) : (
          <>
            {
              // false &&
              gamesList?.map((value, index) => {
                return (
                  <GameListItem
                    activePlayerDiceRolls={activePlayerDiceRolls ?? {}}
                    gameName={`Game #${index + 1}`}
                    key={`Game_List_Item_${index}`}
                    onJoin={() => {
                      onGameSelected(value)
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
    </>
  )
}

export { Game }
