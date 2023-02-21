import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { StrongDieButton } from "../../helpers/Styles"

export const GameItemCard = styled.div`
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

export const GameName = styled.div`
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

export const PlayerList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`

export const PlayerIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  font-size: 20px;
  font-weight: bold;
`

export const PlayerIcon = styled(FontAwesomeIcon)`
  color: #ccc;
  margin-bottom: 5px;
  font-size: 30px;
`

export const FilledPlayerIcon = styled(PlayerIcon)`
  color: #000;
  font-size: 30px;
`

export const ActivePlayerIcon = styled(PlayerIcon)`
  color: #ff5308;
  font-size: 30px;
`

export const EmptyPlayerIcon = styled(PlayerIcon)`
  color: #ccc;
`

export const JoinButton = styled(StrongDieButton)`
  margin-right: 10px;
  background-color: #ff5308;
  color: #000;
  font-weight: bold;

  &:hover {
    background-color: #000;
    color: #ff5308;
  }
`

export const LeaveButton = styled(StrongDieButton)`
  background-color: #ff5308;
  color: #000;
  font-weight: bold;
`