import { Button, Card } from "reactstrap"
import styled from "styled-components"

export const StyledCard = styled(Card)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${(props) => (props.selected ? '#ff5308' : 'white')};

    &:hover {
        box-shadow: 0 0 10px #ccc;
    }

    &:focus {
        background-color: #ff5308;
        color: black;

    & > svg {
        background-color: #ff5308;
        color: black;
        }
    }

    /* CSS for when the card is selected */
    &.selected {
        background-color: #ffc107;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    }
`

export const GameLabel = styled.div`
    font-size: 30px;
    font-weight: bold;
`

export const StyledLabel = styled.div`
    font-size: 12px;
    font-weight: bold;
`

export const FlexedSpaceBetweenDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

export const FlexedDiv = styled.div`
    display: flex;
    justify-content: center;
    > * {
        margin: 5px 5px 0px 5px;
    }
`

export const TightFlexDiv = styled.div`
    display: flex;
    justify-content: center;
    > * {
        margin: 1px 1px 0px 1px;
    }
`

export const StrongDieButton = styled(Button)`
  background-color: #ff5308;
  color: #000;
  font-weight: bold;

  &:hover {
    background-color: #000;
    color: #ff5308;
  }
`