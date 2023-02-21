import { faHatWizard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext, useState } from 'react'
import { Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { JoinGameRequest } from '../../api'
import { AppContext, AppContextDetails } from '../../context'
import { PromiseToJoinGame } from '../../helpers/StrongDieApi'
import { FlexedSpaceBetweenDiv, StrongDieButton } from '../../helpers/Styles'
import { useOnFirstLoad } from '../../helpers/useFirstLoad'

interface IJoinGame {
  gameID: number
  loadGames: () => void
  onClosed: () => void
}

const JoinGameModal = ({ gameID, loadGames, onClosed }: IJoinGame) => {
  const { player, setPlayer } = useContext<AppContextDetails>(AppContext)
  const [loadJoiningGame, setLoadJoiningGame] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') ?? '')
  const handleInputKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleJoinGame(userName)
    }
  }

  const toggleJoinGameModal = useCallback(() => {
    onClosed()
  }, [onClosed])

  const handleJoinGame = useCallback(
    (userName: string) => {
      if (gameID <= 0) return
      setLoadJoiningGame(true)
      const request: JoinGameRequest = {
        userName: userName,
        gameID: gameID,
      }
      return PromiseToJoinGame(request)
        .then((response) => {
          if (response?.player) {
            setPlayer(response.player)
          }
        })
        .catch((error) => {
          console.log(error)
          return error
        })
        .finally(() => {
          setLoadJoiningGame(false)
          toggleJoinGameModal()
          loadGames()
        })
    },
    [gameID, loadGames, setPlayer, toggleJoinGameModal]
  )

  const playerExists = player && player.userName ? false : true
  useOnFirstLoad(() => {
    if (player && player.userName) {
      handleJoinGame(player.userName)
    }
  })

  return (
    <>
      <Modal autoFocus={false} isOpen={playerExists} onClosed={onClosed}>
        <ModalHeader>Join Game</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label>
                <FlexedSpaceBetweenDiv>Player Name:</FlexedSpaceBetweenDiv>
              </Label>
              <FlexedSpaceBetweenDiv>
                <Input
                  autoFocus={true}
                  defaultValue={userName}
                  onChange={(event) => {
                    setUserName(event?.target?.value ?? 0)
                    localStorage.setItem('localUserName', event?.target?.value)
                  }}
                  onKeyDown={handleInputKeyDown}
                  style={{ width: '80%' }}
                  type="text"
                />
              </FlexedSpaceBetweenDiv>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StrongDieButton color="secondary" onClick={toggleJoinGameModal} style={{ marginRight: '10px' }}>
              Cancel
            </StrongDieButton>
            <StrongDieButton
              color="primary"
              disabled={loadJoiningGame}
              onClick={() => {
                handleJoinGame(userName)
              }}
              style={{ marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={faHatWizard} /> Apply
            </StrongDieButton>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { JoinGameModal }
