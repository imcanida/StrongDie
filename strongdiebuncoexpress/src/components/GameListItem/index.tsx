import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Player } from '../../api'
import { AppContextDetails, AppContext } from '../../context'
import { TightFlexDiv } from '../../helpers/Styles'
import { useOnFirstLoad } from '../../helpers/useFirstLoad'
import DieMap from '../DieControl/DieMap'
import { GameItemCard, PlayerIconContainer, ActivePlayerIcon, FilledPlayerIcon, EmptyPlayerIcon, GameName, PlayerList, JoinButton, LeaveButton } from './StyledComponents'

interface IGameListItem {
  gameName: string
  players: Player[]
  onJoin?: () => void
  onLeave?: () => void
  activePlayerDiceRolls: { [key: string]: number[] }
}

const GameListItem = ({ gameName, players, onJoin, onLeave, activePlayerDiceRolls }: IGameListItem) => {
  const { player } = useContext<AppContextDetails>(AppContext)
  
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