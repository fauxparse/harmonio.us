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
      <div
        className="infinite-scroll"
        ref={el => this.el = el}
        onTouchStart={e => this.dragStart(e)}
      >
        <div
          className="infinite-scroll-content"
          style={{ transform: `translateY(${-offset}px)` }}
        >
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

  pageY(e) {
    if (e.touches.length) {
      e = e.touches[0]
    }
    return e.pageY
  }

  dragStart = e => {
    const { offset: initialOffset } = this.state
    const origin = this.pageY(e)

    this.dragging = {
      origin,
      initialOffset
    }

    window.addEventListener('touchmove', this.dragMove)
    window.addEventListener('touchend', this.dragEnd)
  }

  dragMove = e => {
    const { origin, initialOffset } = this.dragging
    const offset = origin - this.pageY(e) + initialOffset
    requestAnimationFrame(() => {
      this.setState({ offset })
    })
  }

  dragStop = e => {
    window.removeEventListener('touchmove', this.dragMove)
    window.removeEventListener('touchend', this.dragEnd)
  }
}
