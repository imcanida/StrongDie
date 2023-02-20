import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { Player } from '../../api'
import { AppContextDetails, AppContext } from '../../context'
import { FlexedDiv, StrongDieButton, TightFlexDiv } from '../../helpers/Styles'
import { useOnFirstLoad } from '../../helpers/useFirstLoad'
import { DieControl } from '../DieControl'
import DieMap from '../DieControl/DieMap'
import { useSignalRGameHub } from '../useSignalRGameHub'

const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 2px #ccc;
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
`

const GameName = styled.div`
  font-size: 24px;
  font-style: italic;
  font-weight: bold;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`

const PlayerList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`

const PlayerIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  font-size: 20px;
  font-weight: bold;
`

const PlayerIcon = styled(FontAwesomeIcon)`
  color: #ccc;
  margin-bottom: 5px;
  font-size: 30px;
`

const FilledPlayerIcon = styled(PlayerIcon)`
  color: #000;
  font-size: 30px;
`

const ActivePlayerIcon = styled(PlayerIcon)`
  color: #ff5308;
  font-size: 30px;
`

const EmptyPlayerIcon = styled(PlayerIcon)`
  color: #ccc;
`

const JoinButton = styled(StrongDieButton)`
  margin-right: 10px;
  background-color: #ff5308;
  color: #000;
  font-weight: bold;

  &:hover {
    background-color: #000;
    color: #ff5308;
  }
`

const LeaveButton = styled(StrongDieButton)`
  background-color: #ff5308;
  color: #000;
  font-weight: bold;
`

interface IGameListItem {
  gameName: string
  players: Player[]
  onJoin?: () => void
  onLeave?: () => void
}

const GameListItem = ({ gameName, players, onJoin, onLeave }: IGameListItem) => {
  const { player } = useContext<AppContextDetails>(AppContext)
  const [activePlayerDiceRolls, setActivePlayerDiceRolls] = useState<{ [key: string]: number[] }>({})
  // Map activePlayerDiceRolls from Players.

  const filledPlayerSlots = players.map((participant) => {
    const userName = participant.userName ?? ''
    const activePlayerRolls = activePlayerDiceRolls[userName]
    return (
      <PlayerIconContainer key={`${gameName}_filled_player_slot_${participant.userID}`}>
        {participant.userName === player?.userName ? <ActivePlayerIcon icon={faUser}></ActivePlayerIcon> : <FilledPlayerIcon icon={faUser} />}
        {participant.userName}
        <TightFlexDiv>
          {activePlayerRolls?.map((rollValue, index) => {
            return <FontAwesomeIcon icon={DieMap[rollValue]} key={`${userName}_${index}_roll_value`} />
          })}
        </TightFlexDiv>
      </PlayerIconContainer>
    )
  })

  const emptyPlayerSlots = new Array(4 - players.length).fill(0).map((_, i) => (
    <PlayerIconContainer key={`${gameName}_empty_player_slot_${i}`}>
      <EmptyPlayerIcon icon={faUser} />
      Empty
      <TightFlexDiv>
        <FontAwesomeIcon color={'#c0c0c0'} icon={DieMap[1]} />
        <FontAwesomeIcon color={'#c0c0c0'} icon={DieMap[1]} />
      </TightFlexDiv>
    </PlayerIconContainer>
  ))

  const playerSlots = [...filledPlayerSlots, ...emptyPlayerSlots]
  useSignalRGameHub({
    onJoinGame: (message) => {
      console.log(message)
    },
    onLeaveGame: (message) => {
      if (!message?.userName) return
      const copy = { ...activePlayerDiceRolls }
      delete copy[message?.userName]
      setActivePlayerDiceRolls(copy)
    },
    onDiceRolled: (message) => {
      // Update activePlayerDiceRolls roll by username
      if (!message?.actor?.userName) return
        const copy = { ...activePlayerDiceRolls }
        copy[message?.actor?.userName] = message.diceRollResults
        setActivePlayerDiceRolls(copy)
    },
  })

  useOnFirstLoad(() => {
    for (const key in players) {
      const participant = players[key]
      if (!participant?.userName) return
    }
  })

  return (
    <Card>
      <GameName>{gameName}</GameName>
      <Container>
        <PlayerList>{playerSlots}</PlayerList>
      </Container>
      {onJoin ? <JoinButton onClick={onJoin}>Join</JoinButton> : <LeaveButton onClick={onLeave}>Leave</LeaveButton>}
    </Card>
  )
}

export { GameListItem }
