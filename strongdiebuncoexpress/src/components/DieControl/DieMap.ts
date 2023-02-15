import { IconDefinition, faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from "@fortawesome/free-solid-svg-icons"

const DieMap: { [key: number]: IconDefinition } = {
    1: faDiceOne,
    2: faDiceTwo,
    3: faDiceThree,
    4: faDiceFour,
    5: faDiceFive,
    6: faDiceSix,
}

export default DieMap