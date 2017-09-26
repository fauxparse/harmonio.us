import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class InfiniteScroll extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  state = { offset: 0 }

  render() {
    const { children } = this.props
    const { offset } = this.state
    const el = this.el
    const height = el && el.offsetHeight

    if (!el) setTimeout(this.expectUpdate, 200)

    return (
      <div className="infinite-scroll" ref={el => this.el = el}>
        <div className="infinite-scroll-content" style={{ transform: `translateY(${-offset}px)` }}>
          {el && children({ offset, height })}
        </div>
      </div>
    )
  }

  expectUpdate = () => {
    if (this.el) {
      this.forceUpdate()
    } else {
      setTimeout(this.expectUpdate, 20)
    }
  }
}
