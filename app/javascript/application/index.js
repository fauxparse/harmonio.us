import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Authentication from './components/authentication'
import App from './components/app'
import reject from 'lodash/reject'
import isNil from 'lodash/isNil'

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
const ID_GENERATORS = {
  __default: o => reject([o.__typename, o.id], isNil).join(':'),
  Occurrence: o => `Occurrence:${o.event.id}:${o.startsAt}`
}
const dataIdFromObject = object =>
  (ID_GENERATORS[object] || ID_GENERATORS.__default)(object)
const client = new ApolloClient({ networkInterface, dataIdFromObject })

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Router>
        <Authentication>
          <App />
        </Authentication>
      </Router>
    </ApolloProvider>,
    document.body.appendChild(document.createElement('div'))
  )
})
