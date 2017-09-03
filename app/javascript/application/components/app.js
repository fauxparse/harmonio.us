import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { SessionShape } from './authentication'

export default class App extends React.Component {
  static contextTypes = {
    session: SessionShape
  }

  render() {
    const { session } = this.context

    return (
      <div className="application">
        🐸
        {session.user.email}
        <button onClick={session.logOut}>Log out</button>
      </div>
    )
  }
}
