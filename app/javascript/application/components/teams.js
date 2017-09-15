import React from 'react'
import ReactDOM from 'react-dom'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import SectionNavigation from './section_navigation'
import TeamList from './team_list'
import TeamDetails from './team_details'
import TeamMembers from './team_members'
import TeamMember from './team_member'

class Teams extends React.Component {
  render() {
    const { location, match: { path, url } } = this.props

    return (
      <SectionNavigation location={location}>
        <Switch location={location}>
          <Route path={`${path}/:team/members/:id`} component={TeamMember} />
          <Route path={`${path}/:team/members`} component={TeamMembers} />
          <Route path={`${path}/:team`} component={TeamDetails} />
          <Route path={path} component={TeamList} />
        </Switch>
      </SectionNavigation>
    )
  }
}

export default Teams
