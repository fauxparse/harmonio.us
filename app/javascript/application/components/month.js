import React from 'react'
import ReactDOM from 'react-dom'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'
import moment from 'moment-timezone'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import keys from 'lodash/keys'

class CalendarEvent extends React.Component {
  render() {
    const { startsAt, endsAt, name, team } = this.props

    return (
      <Link to={this.url()}>
        <h5>{name}</h5>
        <small>{startsAt.format('dddd, h:mm A')}</small>
      </Link>
    )
  }

  url() {
    const { team, slug, startsAt } = this.props
    return `/${team.slug}/events/${slug}/${startsAt.format('YYYY-MM-DD')}`
  }
}

class CalendarEvents extends React.Component {
  render() {
    const { date, events } = this.props

    return (
      <div className="day">
        <h4>{date.format('D')}</h4>
        <ul>
          {events.map(({ startsAt, event: { name, slug, team } }, i) => (
            <li key={i}>
              <CalendarEvent
                name={name}
                slug={slug}
                startsAt={moment(startsAt)}
                team={team}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default class Month extends React.Component {
  state = {}

  render() {
    const { month, events } = this.props
    const grouped = groupBy(events || [], o => o.startsAt.slice(0, 10))

    return (
      <section className="month">
        <h3>{month.format('MMMM YYYY')}</h3>

        {keys(grouped)
          .sort()
          .map(k => (
            <CalendarEvents key={k} date={moment(k)} events={grouped[k]} />
          ))}
      </section>
    )
  }
}
