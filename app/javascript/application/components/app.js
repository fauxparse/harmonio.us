import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import { SessionShape } from './authentication'
import Sidebar from './sidebar'
import Teams from './teams'

export default class App extends React.Component {
  static contextTypes = {
    session: SessionShape
  }

  render() {
    const { session } = this.context
    const { name, email } = session.user || {}

    return (
      <div className="application">
        <Sidebar />
        <main>
          <Switch>
            <Route path="/teams" component={Teams} />
            <Redirect from="/" to="/teams" />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    )
  }
}
