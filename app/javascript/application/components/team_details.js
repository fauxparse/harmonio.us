import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { graphql, gql } from 'react-apollo'
import { Users as UsersIcon } from '../icons'

class TeamDetails extends React.Component {
  render() {
    const { data: { loading, team }, match: { url } } = this.props

    return (
      <section className="team-details">
        <header>
          <h2>{team && team.name}</h2>
        </header>
        <section>
          <ul className="team-actions">
            <li>
              <Link to={`${url}/members`}>
                <UsersIcon />
                <span>Members</span>
              </Link>
            </li>
          </ul>
        </section>
      </section>
    )
  }
}

const TEAM_DETAILS_QUERY = gql`
  query TeamDetailsQuery($id: String!) {
    team(id: $id) {
      id
      name
      slug
    }
  }
`

export default graphql(TEAM_DETAILS_QUERY, {
  options: props => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      id: props.match.params.team
    }
  })
})(TeamDetails)
