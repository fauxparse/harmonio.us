import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { SessionShape } from './authentication'
import TeamList from './team_list'

export default class App extends React.Component {
  static contextTypes = {
    session: SessionShape
  }

  render() {
    const { session } = this.context
    const { name, email } = session.user || {}

    return (
      <div className="application">
        <header>
          <span>
            {name || email}
          </span>
          <button onClick={session.logOut}>Log out</button>
        </header>
        <TeamList />
      </div>
    )
  }
}
