import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'

class TeamMembers extends React.Component {
  render() {
    const { data: { loading, team }, match: { path, url } } = this.props

    return (
      <section className="team-members">
        <ul className="members">
          {team && team.members.map(member => (
            <li key={member.id}>
              <Link to={`${url}/${member.slug}`}>
                {member.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }
}

const TEAM_MEMBERS_QUERY = gql`
  query TeamMembersQuery($id: String!) {
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

export default graphql(TEAM_MEMBERS_QUERY, {
  options: props => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      id: props.match.params.team
    }
  })
})(TeamMembers)
