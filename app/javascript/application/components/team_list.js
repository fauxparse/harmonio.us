import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Route, Link } from 'react-router-dom'
import { Teams as TeamIcon } from '../icons'

class TeamList extends React.Component {
  render() {
    const { data: { loading, teams }, match: { path } } = this.props

    return (
      <section className="team-list">
        <header>
          <h2>Teams</h2>
        </header>
        <section>
          <ul className="teams">
            {!loading &&
              teams.map(({ id, name, slug }) =>
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

const TEAMS_QUERY = gql`
  query TeamListQuery {
    teams {
      id
      name
      slug
    }
  }
`

export default graphql(TEAMS_QUERY, {
  options: { notifyOnNetworkStatusChange: true }
})(TeamList)
