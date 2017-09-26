import React from 'react'
import ReactDOM from 'react-dom'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import SectionNavigation from './section_navigation'
import EventCalendar from './event_calendar'

export default class Events extends React.Component {
  render() {
    const { location, match: { path, url } } = this.props

    return (
      <SectionNavigation location={location}>
        <Switch location={location}>
          <Route path={path} component={EventCalendar} />
        </Switch>
      </SectionNavigation>
    )
  }
}
