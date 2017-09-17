import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Route, Link } from 'react-router-dom'
import { Teams as TeamIcon } from '../icons'
import { SessionShape } from './authentication'

export default class TeamList extends React.Component {
  static contextTypes = {
    session: SessionShape
  }

  render() {
    const { match: { path } } = this.props
    const { session: { user } } = this.context
    const teams = user && user.memberships.map(({ team }) => team) || []

    return (
      <section className="team-list">
        <header>
          <h2>Teams</h2>
        </header>
        <section>
          <ul className="teams">
            {teams.map(({ id, name, slug }) =>
              <li key={id}>
                <Link to={`${path}/${slug}`}>
                  <div className="avatar"><TeamIcon /></div>
                  <span>{name}</span>
                </Link>
              </li>
            )}
          </ul>
        </section>
      </section>
    )
  }
}
