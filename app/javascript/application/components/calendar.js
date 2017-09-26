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
    for (let index = this.indexAt(offset), totalHeight = this.top(index) - offset; totalHeight < height; totalHeight += this.height(index), index++) {
      dates.push([
        origin.clone().add(index * INTERVAL, 'months'),
        origin.clone().add(index * INTERVAL + INTERVAL, 'months'),
        index
      ])
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
    return this.state.heights[index] || DEFAULT_HEIGHT
  }

  resized(index, height) {
    let { heights, min, max } = this.state
    heights[index] = height
    min = Math.min(index, min)
    max = Math.max(index, max)
    this.setState({ heights, min, max })
  }
}
