import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment-timezone'
import CalendarPeriod from './calendar_period'

const INTERVAL = 3
const DEFAULT_HEIGHT = 96 * INTERVAL

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    const origin = moment().startOf('month')
    this.state = { origin, heights: {}, min: 0, max: 0 }
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
    let index = this.indexAt(start)
    let startTime = origin.clone().add(index * INTERVAL, 'months')
    let stopTime = startTime.clone().add(INTERVAL, 'months')

    for (
      let y = this.top(index) - offset;
      y < stop;
      (y += this.height(index)), index++
    ) {
      dates.push([startTime, stopTime, index])
      startTime = stopTime.clone()
      stopTime = startTime.clone().add(INTERVAL, 'months')
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
    if (index < 0) {
      return this.top(index + 1) - this.height(index)
    } else if (index == 0) {
      return 0
    } else {
      return this.top(index - 1) + this.height(index - 1)
    }
  }

  height(index) {
    return this.state.heights[index] || this.props.height
  }

  resized(index, height) {
    let { heights, min, max } = this.state
    heights[index] = height
    min = Math.min(index, min)
    max = Math.max(index, max)
    this.setState({ heights, min, max })
  }
}
