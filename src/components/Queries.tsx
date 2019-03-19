import gql from 'graphql-tag'
import * as React from 'react'
import { useQuery } from 'react-apollo-hooks'

interface Props {}

export const Queries: React.FC<Props> = () => {
  const q1 = useQuery(
    gql`
      {
        getCount @client(always: true)
      }
    `,
  )

  // isMaxHPDivisibleByCount is not recomputed if the count changes
  // https://github.com/trojanowski/react-apollo-hooks/issues/13
  // consider using Query component
  const q2 = useQuery(
    gql`
      {
        pokemon(name: "Bulbasaur") {
          name
          maxHP
          isMaxHPOdd @client
          isMaxHPDivisibleByCount @client(always: true)
          randomPerson @client {
            gender
            name {
              title
              first
              last
            }
          }
          isFavorite @client(always: true) # cache fetch policy
        }
      }
    `,
  )

  return (
    <div>
      <h1>Resolver Queries</h1>
      <div>count: {q1.data.getCount}</div>
      <div>Pokemon Name: {q2.data.pokemon && `${q2.data.pokemon.name}`}</div>
      <div>MaxHP: {q2.data.pokemon && `${q2.data.pokemon.maxHP}`}</div>
      <div>
        isMaxHPOdd: {q2.data.pokemon && `${q2.data.pokemon.isMaxHPOdd}`}
      </div>
      <div>
        isMaxHPDivisibleByCount:
        {q2.data.pokemon && `${q2.data.pokemon.isMaxHPDivisibleByCount}`}
      </div>
      <div>
        randomPerson:{' '}
        {q2.data.pokemon &&
          `${q2.data.pokemon.randomPerson.name.first} ${
            q2.data.pokemon.randomPerson.name.last
          }`}
      </div>
    </div>
  )
}
