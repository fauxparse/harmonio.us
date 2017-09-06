import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'

class TeamList extends React.Component {
  render() {
    const { data: { loading, teams } } = this.props

    return (
      <ul className="teams">
        {!loading && teams.map(({ id, name }) => (
          <li key={id}>
            {name}
          </li>
        ))}
      </ul>
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

export default graphql(TEAMS_QUERY, { options: { notifyOnNetworkStatusChange: true } })(TeamList)
