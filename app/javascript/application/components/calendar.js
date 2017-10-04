import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment-timezone'
import CalendarPeriod from './calendar_period'

const INTERVAL = 1
const DEFAULT_HEIGHT = 96 * INTERVAL

export default class Calendar extends React.PureComponent {
  constructor(props) {
    super(props)
    const origin = moment().startOf('month')
    this.state = { origin, heights: {}, tops: { 0: 0 }, min: 0, max: 0 }
  }

  render() {
    return (
      <div className="calendar">
        {this.periods().map(([start, stop, index]) => (
          <CalendarPeriod
            start={start}
            stop={stop}
            style={{ transform: `translateY(${this.top(index)}px)` }}
            key={index}
            onResize={height => this.resized(index, height)}
          />
        ))}
      </div>
    )
  }

  periods() {
    const { offset, height } = this.props
    const { origin } = this.state
    let totalHeight = 0
    let dates = []
    let start = offset - height
    let stop = offset + height * 1.5
    let startIndex = this.indexAt(start)
    let stopIndex = this.indexAt(stop)
    let startTime = origin.clone().add(startIndex * INTERVAL, 'months')

    for (let i = startIndex, stopTime; i <= stopIndex; i++) {
      stopTime = startTime.clone().add(INTERVAL, 'months')
      dates.push([startTime, stopTime, i])
      startTime = stopTime.clone()
    }
    return dates
  }

  index(month) {
    return Math.floor(month.diff(this.state.origin, 'months') / INTERVAL)
  }

  indexAt(offset) {
    let { min, max } = this.state
    let mid = Math.floor((min + max) / 2)

    while (min < max) {
      let top = this.top(mid)

      if (offset >= top) {
        if (offset < top + this.height(mid)) {
          break
        } else {
          min = mid + 1
        }
      } else {
        max = mid - 1
      }

      mid = Math.floor((min + max) / 2)
    }

    while (offset > this.top(mid) + this.height(mid)) {
      mid++
    }

    while (offset < this.top(mid)) {
      mid--
    }

    return mid
  }

  top(index) {
    const { tops } = this.state

    // if (tops[index] !== undefined) {
    //   return tops[index]
    if (index === 0) {
      return 0
    } else if (index < 0) {
      return this.top(index + 1) - this.height(index)
    } else if (index > 0) {
      return this.top(index - 1) + this.height(index - 1)
    }
  }

  height(index) {
    return this.state.heights[index] || this.props.height
  }

  resized(index, height) {
    let { heights, min, max, tops } = this.state
    heights[index] = height
    min = Math.min(index, min)
    max = Math.max(index, max)

    if (index < 0) {
      for (let i = index; i >= min; i--) {
        tops[i] = tops[i + 1] - this.height(i)
      }
    } else if (index > 0) {
      for (let i = index + 1; i <= max; i++) {
        tops[i] = tops[i - 1] + this.height(i + 1)
      }
    }

    this.setState({ heights, tops, min, max })
  }
}
