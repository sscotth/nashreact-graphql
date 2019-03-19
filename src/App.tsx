import React, { useEffect, useState } from 'react'

import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-boost'
import { RestLink } from 'apollo-link-rest'
import { ApolloProvider } from 'react-apollo-hooks'
import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas,
} from 'graphql-tools'
import { SchemaLink } from 'apollo-link-schema'

import { DirectQuery } from './components/DirectQuery'
import { DirectWrite } from './components/DirectWrite'
import { Mutations } from './components/Mutations'
import { Queries } from './components/Queries'
import { Todos } from './components/Todos'
import { Variables } from './components/Variables'

import { resolvers } from './resolvers'

const initApollo = async () => {
  // With Apollo Boost
  // const client = new ApolloClient({
  //   uri: 'https://swapi.graph.cool',
  //   resolvers: resolvers as any,
  // })

  // RestLink
  // const client = new ApolloClient({
  //   link: new RestLink({
  //     uri: 'https://blockchain.info/ticker?cors=true',
  //   }),
  //   cache: new InMemoryCache(),
  //   resolvers: resolvers as any,
  // })

  // Combine Rest and GraphQL Links
  // const client = new ApolloClient({
  // link: ApolloLink.from([
  //   new RestLink({
  //     uri: 'https://blockchain.info/ticker?cors=true',
  //   }),
  //   new HttpLink({
  //     uri: 'https://swapi.graph.cool',
  //   }),
  // ]),
  //   cache: new InMemoryCache(),
  //   resolvers: resolvers as any,
  // })

  // Mulitple GraphQL Links
  const uri1 = 'https://swapi.graph.cool'
  const uri2 = 'https://graphql-pokemon.now.sh'

  const getRemoteExecutableSchema = async (uri: string) => {
    const httpLink = new HttpLink({ uri })
    const remoteSchema = await introspectSchema(httpLink)
    return makeRemoteExecutableSchema({
      schema: remoteSchema,
      link: httpLink,
    })
  }

  const executableSchema1 = await getRemoteExecutableSchema(uri1)
  const executableSchema2 = await getRemoteExecutableSchema(uri2)

  const newSchema = mergeSchemas({
    schemas: [executableSchema1, executableSchema2],
  })

  const client = new ApolloClient({
    link: ApolloLink.from([
      new RestLink({
        uri: 'https://blockchain.info/ticker?cors=true',
      }),
      new SchemaLink({
        schema: newSchema,
      }),
    ]),
    cache: new InMemoryCache(),
    resolvers: resolvers as any,
  })

  const initData = () =>
    client.writeData({
      data: {
        count: 5,
        todos: [
          {
            __typename: 'Todo',
            id: 1,
            text: 'wash dishes',
            complete: false,
          },
        ],
      },
    })

  initData()

  // client.resetStore()
  client.onResetStore(async () => {
    initData()
  })
  // client.clearStore()
  client.onClearStore(async () => {
    initData()
  })

  return client
}

const App = () => {
  const [client, setClient] = useState()

  useEffect(() => {
    initApollo().then(c => setClient(c))
  }, [])

  if (!client) {
    return <div>Loading ...</div>
  }

  return (
    <ApolloProvider client={client}>
      <DirectWrite />
      <Mutations />
      <DirectQuery />
      <Queries />
      <Variables />
      <Todos />
    </ApolloProvider>
  )
}

export default App
