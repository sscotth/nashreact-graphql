import gql from 'graphql-tag'
import * as React from 'react'
import { useQuery } from 'react-apollo-hooks'

interface Props {}

export const DirectQuery: React.FC<Props> = () => {
  const { data, loading } = useQuery(
    gql`
      {
        # LOCAL ONLY
        count @client

        # SW GRAPHQL API
        Planet(name: "Tatooine") {
          climate
        }

        # BITCOIN REST API
        price @rest(type: "foo", path: "/") {
          USD
        }

        # POKEMON GRAPHQL API
        pokemon(name: "Pikachu") {
          maxHP
        }
      }
    `,
  )

  // loading is true until slowest query is fetched
  if (loading) {
    return <div>...loading</div>
  }

  return (
    <div>
      <h1>Direct Query</h1>
      <div>count {data.count}</div>
      {data.Planet ? <div>Tatooine: {data.Planet.climate}</div> : null}
      {data.price ? (
        <div>
          Price {data.price.USD.symbol}
          {data.price.USD.last}
        </div>
      ) : null}
      {data.pokemon ? <div>Pikachu maxHP: {data.pokemon.maxHP}</div> : null}
    </div>
  )
}
