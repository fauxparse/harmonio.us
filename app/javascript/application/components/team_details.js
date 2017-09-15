import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class TeamDetails extends React.Component {
  render() {
    const { match: { path, url } } = this.props

    return (
      <section className="team-details">
        <header>
        </header>
        <section>
          <Link to={`${url}/members`}>Members</Link>
        </section>
      </section>
    )
  }
}
