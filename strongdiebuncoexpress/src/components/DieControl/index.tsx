import { faDiceOne, faWeightHanging, faHatWizard, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Alert, CardBody } from 'reactstrap'
import { LoadDiceSettingsRequest, LoadedDieSetting, Player } from '../../api'
import DieMap from './DieMap'
import { StrongDieApi } from '../../helpers/StrongDieApi'
import { FlexedSpaceBetweenDiv, StrongDieButton, StyledCard, StyledLabel } from '../../helpers/Styles'
import FactorDescriptionMap from './FactorDescriptionMap'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

interface IDieControl {
  user?: Player
  dieValue?: number
  roll?: boolean
  loadedDieSetting?: LoadedDieSetting
  onUpdate?: (loadedDieSetting: any) => void
  size?: SizeProp
}

const DieControl = ({ user, dieValue = 1, roll = false, loadedDieSetting, onUpdate, size ='6x' }: IDieControl) => {
  // -- State Management --
  const [loadedDieSettingsModal, setShowLoadedDieSettingsModal] = useState<boolean>(false)

  const [dieToShow, setDieToShow] = useState<IconDefinition>(faDiceOne)
  const [factor, setFactor] = useState<any>(loadedDieSetting?.factor ?? 1)
  const [favorValue, setFavorValue] = useState<number>(loadedDieSetting?.favor ?? 1)
  const [favorSelection, setFavorSelection] = useState<any>(DieMap[favorValue])
  const [lastDieValue, setLastDieValue] = useState<number>(0)

  // -- Value Toggles --
  const toggleDieWeightSettingsModal = () => setShowLoadedDieSettingsModal(!loadedDieSettingsModal)
  const handleFavorSelection = (selection: IconDefinition, dieValue: number) => {
    setFavorSelection(selection)
    setFavorValue(dieValue)
  }

  // -- Methods --
  const convertToIconDefinition = (value: number) => {
    const keyValues = Object.keys(DieMap).map((i) => parseInt(i))
    const maxValue = Math.max(...keyValues)
    // Cap at each side - ternops
    value = value < 0 ? 0 : value > maxValue ? maxValue : value
    setDieToShow(DieMap[value])
  }

  const rollThemDie = useCallback(() => {
    // "roll It"
    const roll = Math.floor(1 + Math.random() * 7)
    convertToIconDefinition(roll)
  }, [])

  const updateLoadedSettings = () => {
    const newLoadedDieSetting: LoadedDieSetting = {
      favor: favorValue,
      factor: factor,
      index: loadedDieSetting?.index,
    }
    const userID = user?.userID ?? 0
    if (user === null || userID <= 0) {
      toggleDieWeightSettingsModal()
      if (onUpdate) {
        onUpdate(newLoadedDieSetting)
      }
      return
    }
    const request: LoadDiceSettingsRequest = {
      userID: userID,
      loadedDieSettings: [newLoadedDieSetting],
    }
    StrongDieApi.loadedDiceUpdateCreate(request)
      .then((response) => {
        if (onUpdate) {
          const updatedSettings = response.data.updatedLoadedDieSettings?.shift()
          onUpdate(updatedSettings)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        toggleDieWeightSettingsModal()
      })
  }

  // -- Watchers --
  useEffect(() => {
    if (lastDieValue === dieValue) return
    setFavorValue(dieValue)
    setDieToShow(DieMap[dieValue])
    setLastDieValue(dieValue)
  }, [dieValue, lastDieValue])

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    if (roll) {
      intervalId = setInterval(rollThemDie, 400)
    }
    return () => clearInterval(intervalId)
  }, [roll, rollThemDie])

  const dieValues = Object.values(DieMap)
  return (
    <div data-testid="die-control">
      <div>
        <FontAwesomeIcon
          color={loadedDieSetting?.favor === favorValue && (loadedDieSetting?.factor ?? 0) > 0 ? '#ff5308' : '#000'}
          icon={dieToShow}
          size={size ?? '6x'}
        />
        {loadedDieSetting && (
          <>
            <div>
              <Button onClick={toggleDieWeightSettingsModal} outline>
                <FontAwesomeIcon icon={faWeightHanging} />
              </Button>
            </div>
          </>
        )}
      </div>
      <Modal isOpen={loadedDieSettingsModal} toggle={toggleDieWeightSettingsModal}>
        <ModalHeader toggle={toggleDieWeightSettingsModal}>Die Weight Settings</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label>Favor</Label>
              <FlexedSpaceBetweenDiv>
                {dieValues.map((iconValue, dieValue) => {
                  return (
                    <StyledCard
                      key={`select_die_to_favor_${dieValue}`}
                      onClick={() => {
                        handleFavorSelection(iconValue, dieValue + 1)
                      }}
                      selected={favorSelection === iconValue}
                      tabIndex={dieValue}
                    >
                      <CardBody className="text-center" key={dieValue} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={iconValue} size="2x" />
                        <StyledLabel>Select</StyledLabel>
                      </CardBody>
                    </StyledCard>
                  )
                })}
              </FlexedSpaceBetweenDiv>
              <div style={{ marginTop: '10px' }}>
                <Alert color="info">
                  <small>Weight in which the die will favor the selected face.</small>
                </Alert>
              </div>
            </FormGroup>
            <FormGroup row>
              <Label>
                <FlexedSpaceBetweenDiv>
                  Factor:
                  <h3>
                    <em>{FactorDescriptionMap[factor]}</em>
                  </h3>
                </FlexedSpaceBetweenDiv>
              </Label>
              <FlexedSpaceBetweenDiv>
                <input
                  defaultValue={factor}
                  max="5"
                  min="1"
                  onChange={(event) => {
                    setFactor(event?.target?.value ?? 0)
                  }}
                  step="1"
                  style={{ width: '80%' }}
                  type="range"
                />
                <label style={{ fontSize: '24px', textAlign: 'right' }}>x {factor}</label>
              </FlexedSpaceBetweenDiv>
              <div>
                <Alert color="info">
                  <small>Weight in which the die will favor the selected face.</small>
                </Alert>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StrongDieButton color="secondary" onClick={toggleDieWeightSettingsModal} style={{ marginRight: '10px' }}>
              Cancel
            </StrongDieButton>
            <StrongDieButton color="primary" onClick={updateLoadedSettings} style={{ marginRight: '10px' }}>
              <FontAwesomeIcon icon={faHatWizard} /> Apply
            </StrongDieButton>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  )
}
export { DieControl }
