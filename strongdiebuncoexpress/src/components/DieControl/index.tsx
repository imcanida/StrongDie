import { faDiceOne, faWeightHanging, faHatWizard, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Alert, CardBody } from 'reactstrap'
import { LoadDiceSettingsRequest, LoadedDieSetting } from '../../api'
import DieMap from './DieMap'
import { StrongDieApi } from '../../helpers/StrongDieApi'
import { FlexedSpaceBetweenDiv, StyledCard, StyledLabel } from '../../helpers/Styles'
import FactorDescriptionMap from './FactorDescriptionMap'

interface IDieControl {
  user?: any
  dieValue?: number
  shake?: boolean
  loadedDieSetting: LoadedDieSetting
  onUpdate?: (loadedDieSetting: any) => void
}

const DieControl = ({ user, dieValue = 1, shake = false, loadedDieSetting, onUpdate }: IDieControl) => {
  // -- State Management --
  const [modal, setModal] = useState<boolean>(false)
  const [favorSelection, setFavorSelection] = useState<any>(DieMap[1])
  const [dieToShow, setDieToShow] = useState<IconDefinition>(faDiceOne)
  const [factor, setFactor] = useState<any>('1')
  const [lastDieValue, setLastDieValue] = useState<number>(0)

  // -- Value Toggles --
  const toggleDieWeightSettingsModal = () => setModal(!modal)
  const handleFavorSelection = (selection: IconDefinition) => setFavorSelection(selection)

  // -- Methods --
  const convertToIconDefinition = (value: number) => {
    const keyValues = Object.keys(DieMap).map((i) => parseInt(i))
    const maxValue = Math.max(...keyValues)
    // Cap at each side - ternops
    value = value < 0 ? 0 : value > maxValue ? maxValue : value
    setDieToShow(DieMap[value])
  }

  const shakeThemDice = useCallback(() => {
    if(!shake) return
    // "Shake It"
    // Set a timeout to call itself, to shake while we're shaking.
    setTimeout(() => {
      const roll = Math.floor(1 + Math.random() * 7)
      convertToIconDefinition(roll)
      shakeThemDice()
    }, 400)
  }, [])

  const updateLoadedSettings = () => {
    if (user?.id ?? null) {
      toggleDieWeightSettingsModal()
      if (onUpdate) {
        onUpdate(loadedDieSetting)
      }
      return
    }
    const request: LoadDiceSettingsRequest = {
      userID: user.id,
      loadedDieSettings: [loadedDieSetting],
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
    setDieToShow(DieMap[dieValue])
    setLastDieValue(dieValue)
  }, [dieValue, lastDieValue])

  useEffect(() => {
    if (shake) {
      shakeThemDice()
    }
  }, [shake, shakeThemDice])

  const dieValues = Object.values(DieMap)
  return (
    <>
      <div>
        <FontAwesomeIcon icon={dieToShow} size="6x" />
        <br />
        <Button outline onClick={toggleDieWeightSettingsModal}>
          <FontAwesomeIcon icon={faWeightHanging} />
        </Button>
      </div>
      <Modal isOpen={modal} toggle={toggleDieWeightSettingsModal}>
        <ModalHeader toggle={toggleDieWeightSettingsModal}>Die Weight Settings</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label>Favor</Label>
              <FlexedSpaceBetweenDiv>
                {dieValues.map((value, index) => {
                  return (
                    <>
                      <StyledCard
                        tabIndex={index}
                        key={index}
                        onClick={() => {
                          handleFavorSelection(value)
                        }}
                        selected={favorSelection === value}
                      >
                        <CardBody className="text-center" style={{ cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={value} size="2x" />
                          <StyledLabel>Select</StyledLabel>
                        </CardBody>
                      </StyledCard>
                    </>
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
                  type="range"
                  defaultValue={factor}
                  min="1"
                  max="5"
                  onChange={(event) => {
                    setFactor(event?.target?.value ?? 0)
                  }}
                  style={{ width: '80%' }}
                  step="1"
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
            <Button color="secondary" onClick={toggleDieWeightSettingsModal} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={updateLoadedSettings}
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
export default DieControl
