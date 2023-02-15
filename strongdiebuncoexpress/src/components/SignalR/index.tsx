import React, { useEffect, useState } from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr';
export const HubUrl = "http://localhost:7259/gamehub"; // Replace with your hub URL

const SignalRTest = () => {
  const [connection, setConnection] = useState<any>(null)
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
        .withUrl(HubUrl)
        .build()
    setConnection(newConnection)
  }, [])

  useEffect(() => {
    if (connection) {
      connection.start().then(() => {
        console.log("Connection established");
      })

      connection.on("PlayerConnected", (gameID: number, username: string) => {
        console.log(`${username} has joined game ${gameID}`);
      })

      connection.on("PlayerRolled", (gameID: number, username: string, rolls: number[]) => {
        console.log(`${username} rolled ${rolls} in game ${gameID}`);
      })
    }
  }, [connection])

  return (
    <div>
      <h2>Dice Rolls:</h2>
      {/* <ul>
        {diceRolls.map((diceRoll, index) => (
          <li key={index}>{diceRoll}</li>
        ))}
      </ul> */}
    </div>
  )
}

export default SignalRTest
