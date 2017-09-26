import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Route, Link } from 'react-router-dom'
import InfiniteScroll from './infinite_scroll'
import Calendar from './calendar'

export default class EventCalendar extends React.Component {
  render() {
    return (
      <section className="event-calendar">
        <header>
          <h2>Calendar</h2>
        </header>
        <section>
          <InfiniteScroll>
            {({ offset, height }) => <Calendar offset={offset} height={height} /> }
          </InfiniteScroll>
        </section>
      </section>
    )
  }
}
