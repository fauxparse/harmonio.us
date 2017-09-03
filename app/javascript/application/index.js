import React from 'react'
import ReactDOM from 'react-dom'
import Authentication from './components/authentication'
import App from './components/app'

import {
  ApolloProvider,
  createNetworkInterface,
  ApolloClient
} from 'react-apollo'

const token = document
  .querySelector('[name="csrf-token"]')
  .getAttribute('content')
const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
    headers: {
      'X-CSRF-Token': token
    }
  }
})
const client = new ApolloClient({ networkInterface })

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Authentication>
        <App />
      </Authentication>
    </ApolloProvider>,
    document.body.appendChild(document.createElement('div'))
  )
})
