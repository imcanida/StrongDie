import { faDice, faHatWizard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, CardBody, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
import { GameListDetail, JoinGameRequest, LoadedDieSetting, Player, RollDiceRequest } from '../../api'
import { StrongDieApi } from '../../helpers/StrongDieApi'
import { FlexedDiv, FlexedSpaceBetweenDiv, StyledCard, GameLabel } from '../../helpers/Styles'
import DieControl from '../DieControl'

interface ILoadedDiceSettings {
  shakeDie: boolean
  dieValue: number
  loadedDie: LoadedDieSetting
}

const Game = () => {
  // -- State Management --
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false)
  const [player, setPlayer] = useState<Player>()
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') ?? '')
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
        index: 0,
      },
    },
  ])
  const [gameToJoin, setGameToJoin] = useState<GameListDetail>()
  const [gamesList, setGamesList] = useState<GameListDetail[]>([])
  // Using LocalStorage, For Ease Of local persistence.
  const [loadJoiningGame, setLoadJoiningGame] = useState<boolean>(false)
  const [loadGamesList, setLoadGamesList] = useState<boolean>(false)
  const [loadingDieRoll, setLoadingDieRoll] = useState<boolean>(false)

  // -- Value Toggles --
  const toggleDieWeightSettingsModal = () => setShowJoinModal(!showJoinModal)

  const rollDice = () => {
    const request: RollDiceRequest = {
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
        setDiceValues(newDieValues)
        return response
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoadingDieRoll(false)
      })
  }

  const loadGames = useCallback(() => {
    const playerAsString = localStorage.getItem('userName')
    if (playerAsString) {
      const parsedPlayer = JSON.parse(playerAsString)
      setPlayer(parsedPlayer)
    }
    setLoadGamesList(true)
    StrongDieApi.gameListCreate({})
      .then((response) => {
        setGamesList(response?.data?.games ?? [])
        if (player) {
          // See if they are in a game.
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoadGamesList(false)
      })
  }, [player])

  const handleJoinGame = (gameID: any, name: string) => {
    setLoadJoiningGame(true)
    const request: JoinGameRequest = {
      userName: name,
      gameID: gameID,
    }
    StrongDieApi.gameJoinCreate(request)
      .then((response) => {
        localStorage.setItem('localUserName', userName)
        localStorage.setItem('localPlayer', JSON.stringify(response.data.player))
        setPlayer(response.data.player)
        const index = gamesList?.findIndex((i: GameListDetail) => i.gameID === gameID)
        if (index && index >= 0 && gamesList) {
          const copyOfGames = [...gamesList]
          copyOfGames[index].players = response.data.players
          setGamesList(copyOfGames)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoadJoiningGame(false)
        toggleDieWeightSettingsModal()
        loadGames()
      })
  }

  useEffect(() => {
    loadGames()
  }, [loadGames])

  return (
    <>
      {loadGamesList ? (
        <Spinner />
      ) : (
        <>
          {gamesList?.map((value, index) => {
            return (
              <>
                <StyledCard
                  tabIndex={index}
                  key={index}
                  onClick={() => {
                    toggleDieWeightSettingsModal()
                    setGameToJoin(value)
                  }}
                >
                  <CardBody className="text-center" style={{ cursor: 'pointer' }}>
                    {/* <FontAwesomeIcon icon={value} size="2x" /> */}
                    <GameLabel>{`Join Game #${index + 1}`}</GameLabel>
                    <GameLabel>{`${value.players?.length} of 4 Players`}</GameLabel>
                  </CardBody>
                </StyledCard>
              </>
            )
          })}
          <FlexedDiv>
            <Button onClick={rollDice}>
              Roll <FontAwesomeIcon icon={faDice} />
            </Button>
          </FlexedDiv>
          <FlexedDiv>
            {loadingDieRoll ? 'yes' : 'no'}
            <DieControl
              dieValue={diceValues[0].dieValue}
              shake={loadingDieRoll}
              loadedDieSetting={diceValues[0].loadedDie}
              onUpdate={(newValue: LoadedDieSetting) => {
                if (newValue) {
                  const diceValuesCopy = { ...diceValues }
                  diceValuesCopy[0].loadedDie = newValue
                  setDiceValues(diceValuesCopy)
                }
              }}
            />
            <DieControl
              dieValue={diceValues[1].dieValue}
              shake={loadingDieRoll}
              loadedDieSetting={diceValues[1].loadedDie}
              onUpdate={(newValue: LoadedDieSetting) => {
                if (newValue) {
                  const diceValuesCopy = { ...diceValues }
                  diceValuesCopy[1].loadedDie = newValue
                  setDiceValues(diceValuesCopy)
                }
              }}
            />
          </FlexedDiv>
        </>
      )}

      <Modal isOpen={showJoinModal} toggle={toggleDieWeightSettingsModal}>
        <ModalHeader toggle={toggleDieWeightSettingsModal}>Join Game</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label>
                <FlexedSpaceBetweenDiv>Name:</FlexedSpaceBetweenDiv>
              </Label>
              <FlexedSpaceBetweenDiv>
                <input
                  type="text"
                  defaultValue={userName}
                  onChange={(event) => {
                    setUserName(event?.target?.value ?? 0)
                  }}
                  style={{ width: '80%' }}
                />
              </FlexedSpaceBetweenDiv>
              <div>
                <Alert color="info">
                  <small>Name of the player.</small>
                </Alert>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button color="secondary" onClick={toggleDieWeightSettingsModal} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                handleJoinGame(gameToJoin?.gameID, userName)
              }}
              style={{ marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={faHatWizard} /> Apply
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Game