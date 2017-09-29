import React from 'react'
import ReactDOM from 'react-dom'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'
import moment from 'moment-timezone'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import keys from 'lodash/keys'
import Month from './month'

class CalendarPeriod extends React.Component {
  state = {}

  render() {
    const { style, data: { loading = false, calendar = [] } = {} } = this.props
    const grouped = this.grouped()

    return (
      <div
        className={classNames('calendar-period', { loading })}
        style={style}
        ref={el => this.el = el}
      >
        {!loading &&
          this.grouped().map(([key, events]) => (
            <Month key={key} month={moment(key + '-01')} events={events} />
          ))}
      </div>
    )
  }

  grouped() {
    if (!this._grouped) {
      const { data: { calendar = [] } = {} } = this.props
      const groupedEvents = groupBy(calendar, o => o.startsAt.slice(0, 7))
      const grouped = this.months().reduce(
        (result, month) => {
          const key = month.format('YYYY-MM')
          return { ...result, [key]: groupedEvents[key] || [] }
        },
        {}
      )
      this._grouped = keys(grouped).sort().map(k => [k, grouped[k]])
    }
    return this._grouped
  }

  months() {
    if (!this._months) {
      const { start, stop } = this.props
      this._months = []

      for (let d = start.clone(); d.isBefore(stop); d.add(1, 'month')) {
        this._months.push(d.clone())
      }
    }
    return this._months
  }

  componentWillReceiveProps(props) {
    const { data: { loading = false, calendar = [] } = {}, onResize } = props
    const count = loading ? 0 : calendar.length

    if (!loading && count != this.count) {
      this._grouped = undefined
      this.count = count
      this.props.onResize(this.months().length * 36 + count * 60)
    }
  }
}

const MONTH_QUERY = gql`
  query MonthQuery($start:Date, $stop:Date) {
    calendar(start: $start, stop: $stop) {
      startsAt
      endsAt
      event {
        id
        name
        slug
        team {
          id
          name
          slug
        }
      }
    }
  }
`

export default graphql(MONTH_QUERY, {
  options: props => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      start: props.start.format('YYYY-MM-DD'),
      stop: props.stop.format('YYYY-MM-DD')
    }
  })
})(CalendarPeriod)
