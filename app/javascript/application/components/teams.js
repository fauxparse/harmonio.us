import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import TeamList from './team_list'
import TeamDetails from './team_details'
import TeamMembers from './team_members'
import TeamMember from './team_member'

class Teams extends React.Component {
  render() {
    const { match: { path } } = this.props

    return (
      <section className="teams">
        <Route path={path} component={TeamList} />
        <Route path={`${path}/:team`} component={TeamDetails} />
        <Route path={`${path}/:team/members`} component={TeamMembers} />
        <Route path={`${path}/:team/members/:id`} component={TeamMember} />
      </section>
    )
  }
}

export default Teams
