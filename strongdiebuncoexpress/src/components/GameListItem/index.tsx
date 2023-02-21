import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Player } from '../../api'
import { AppContextDetails, AppContext } from '../../context'
import { TightFlexDiv } from '../../helpers/Styles'
import { useOnFirstLoad } from '../../helpers/useFirstLoad'
import DieMap from '../DieControl/DieMap'
import { useSignalRGameHub } from '../useSignalRGameHub'
import { GameItemCard, PlayerIconContainer, ActivePlayerIcon, FilledPlayerIcon, EmptyPlayerIcon, GameName, PlayerList, JoinButton, LeaveButton } from './StyledComponents'

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
    const activeDieRollElements = activePlayerRolls?.map((rollValue, index) => {
      return <FontAwesomeIcon icon={DieMap[rollValue]} key={`${userName}_${index}_roll_value`} />
    })
    return (
      <PlayerIconContainer key={`${gameName}_filled_player_slot_${participant.userID}`}>
        {participant.userName === player?.userName ? <ActivePlayerIcon icon={faUser}></ActivePlayerIcon> : <FilledPlayerIcon icon={faUser} />}
        {participant.userName}
        <TightFlexDiv>
          {activeDieRollElements ?? (
            <TightFlexDiv>
              <FontAwesomeIcon color={'#c0c0c0'} icon={DieMap[1]} />
              <FontAwesomeIcon color={'#c0c0c0'} icon={DieMap[1]} />
            </TightFlexDiv>
          )}
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
    // Cannot double up event listeners.
    // onLeaveGame: (message) => {
    //   console.log('Game.onLeaveGame', message)
    //   if (!message?.userName) return
    //   const copy = { ...activePlayerDiceRolls }
    //   delete copy[message?.userName]
    //   setActivePlayerDiceRolls(copy)
    // },
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
    <GameItemCard>
      <GameName>{gameName}</GameName>
        <PlayerList>{playerSlots}</PlayerList>
      {onJoin ? <JoinButton onClick={onJoin}>Join</JoinButton> : <LeaveButton onClick={onLeave}>Leave</LeaveButton>}
    </GameItemCard>
  )
}

export { GameListItem }