import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'

class TeamDetails extends React.Component {
  render() {
    const { data: { loading, team }, match: { path } } = this.props

    return (
      <section className="team-details">
        <ul className="team-members">
          {team && team.members.map(member => (
            <li key={member.id}>
              {member.name}
            </li>
          ))}
        </ul>
      </section>
    )
  }
}

const TEAM_DETAILS_QUERY = gql`
  query TeamDetailsQuery($id: ID!) {
    team(id: $id) {
      id
      name
      slug

      members {
        id
        name
        slug
        admin
        registered
      }
    }
  }
`

export default graphql(TEAM_DETAILS_QUERY, {
  options: props => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      id: props.match.params.id
    }
  })
})(TeamDetails)
