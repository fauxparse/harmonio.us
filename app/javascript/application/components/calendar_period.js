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
    const { style, data: { loading, calendar } } = this.props
    const grouped = groupBy(calendar || [], o => o.startsAt.slice(0, 7))

    return (
      <div
        className={classNames('calendar-period', { loading })}
        style={style}
        ref={el => this.el = el}
      >
        {!loading &&
          keys(grouped)
            .sort()
            .map(k => (
              <Month key={k} month={moment(k + '-01')} events={grouped[k]} />
            ))}
      </div>
    )
  }

  componentDidMount() {
    setTimeout(this.resized, 0)
  }

  componentWillReceiveProps(props) {
    const { data: { loading, calendar }, onResize } = props
    const count = loading ? 0 : calendar.length

    if (count != this.state.count) {
      setTimeout(this.resized, 0)
      this.setState({ count })
    }
  }

  resized = () => {
    if (this.el) {
      this.props.onResize(this.el.offsetHeight)
    } else {
      setTimeout(this.resized, 20)
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
