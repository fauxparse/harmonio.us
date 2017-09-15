import React from 'react'
import ReactDOM from 'react-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default class SectionNavigation extends React.Component {
  state = {
    animation: 'fade'
  }

  componentWillReceiveProps(newProps) {
    const oldPath = this.props.location.pathname
    const newPath = newProps.location.pathname

    if (oldPath !== newPath) {
      this.setState({ animation: this.animation(oldPath, newPath) })
    }
  }

  render() {
    const { location, children } = this.props
    const { animation } = this.state

    return (
      <TransitionGroup component="section" className="main-section">
        <CSSTransition key={location.pathname} timeout={375} classNames={animation}>
          {children}
        </CSSTransition>
      </TransitionGroup>
    )
  }

  subpath(pathA, pathB) {
    const a = pathA.split('/')
    const b = pathB.split('/')

    if (a.length < b.length) {
      for (let i = 0; i < a.length; i++) {
        if (a[i][0] !== ':' && b[i][0] !== ':' && a[i] !== b[i]) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  }

  animation(oldPath, newPath) {
    if (this.subpath(oldPath, newPath)) {
      return 'slide-left'
    } else if (this.subpath(newPath, oldPath)) {
      return 'slide-right'
    } else {
      return 'fade'
    }
  }
}
