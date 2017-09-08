import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import TeamList from './team_list'
import TeamDetails from './team_details'

class Teams extends React.Component {
  render() {
    const { match: { path } } = this.props

    return (
      <section className="teams">
        <Route path={path} component={TeamList} />
        <Route path={`${path}/:id`} component={TeamDetails} />
      </section>
    )
  }
}

export default Teams
