import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, Link, withRouter } from 'react-router-dom'
import { SessionShape } from './authentication'
import {
  LogOut as LogOutIcon,
  Menu as MenuIcon,
  Teams as TeamsIcon,
  User as UserIcon
} from '../icons'
import Avatar from './avatar'

const MenuButton = ({ history, location, onOpenSidebar }) => {
  const back = location.pathname.split('/').slice(0, -1).join('/')

  return (
    <button
      className="hamburger"
      rel={back ? 'back' : 'menu'}
      onClick={() => (back ? history.push(back) : onOpenSidebar())}
    >
      <MenuIcon />
    </button>
  )
}

class Sidebar extends React.Component {
  static contextTypes = {
    session: SessionShape
  }

  state = {
    open: false
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname) {
      this.setState({ open: false })
    }
  }

  render() {
    const { session } = this.context
    const { open } = this.state
    const { name, email } = session.user || {}
    const { history, location } = this.props

    return (
      <div className="sidebar-container" aria-hidden={!open}>
        <aside className="sidebar">
          <header>
            <Avatar className="portrait" />
            <p>
              {name && <b>{name}</b>}
              <span>{email}</span>
            </p>
          </header>
          <section>
            <ul>
              <li>
                <Link to="/teams">
                  <TeamsIcon />
                  <span>My teams</span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    session.logOut()
                  }}
                >
                  <LogOutIcon />
                  <span>Log out</span>
                </a>
              </li>
            </ul>
          </section>
        </aside>
        <div
          className="sidebar-overlay"
          onClick={() => this.setState({ open: false })}
        />
        <MenuButton
          history={history}
          location={location}
          onOpenSidebar={() => this.setState({ open: true })}
        />
      </div>
    )
  }
}

export default withRouter(Sidebar)
