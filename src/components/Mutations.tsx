import gql from 'graphql-tag'
import * as React from 'react'
import { useMutation } from 'react-apollo-hooks'

interface Props {}

export const Mutations: React.FC<Props> = () => {
  const increment = useMutation(gql`
    mutation Increment {
      increment @client # Client state only
    }
  `)

  const setCount = useMutation(gql`
    mutation SetCount($count: Int!) {
      setCount(count: $count) @client
    }
  `)

  const handleIncrement = () => increment()

  const handleSetCount = () => {
    const count = Math.floor(Math.random() * 1000)
    setCount({ variables: { count } })
  }

  return (
    <div>
      <h1>Resolver Write</h1>
      <button onClick={handleIncrement}>increment</button>
      <button onClick={handleSetCount}>set count resolver</button>
    </div>
  )
}
