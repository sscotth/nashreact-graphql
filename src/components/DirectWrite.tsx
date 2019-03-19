import * as React from 'react'
import { useApolloClient } from 'react-apollo-hooks'

interface Props {}

// Use for simple writes
// writeData does not validate the shape of the data saved to the cache

export const DirectWrite: React.FC<Props> = () => {
  const client = useApolloClient()

  const setRandomCount = () => {
    const count = Math.floor(Math.random() * 1000)
    client.writeData({ data: { count } })
  }

  return (
    <div>
      <h1>Direct Write</h1>
      <button onClick={setRandomCount}>set count writeData</button>
    </div>
  )
}
