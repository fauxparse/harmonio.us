import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'
import Avatar from './avatar'

class TeamMembers extends React.Component {
  render() {
    const {
      data: { loading, team: { members = [] } = {} },
      match: { path, url }
    } = this.props

    return (
      <section className="team-members">
        <header>
          <h2>Team members</h2>
        </header>
        <section>
          <ul className="members">
            {members.map(member => (
              <li key={member.id}>
                <Link to={`${url}/${member.slug}`}>
                  <Avatar member={member} />
                  <span>{member.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    )
  }
}

const TEAM_MEMBERS_QUERY = gql`
  query TeamMembersQuery($id: String!) {
    team(id: $id) {
      id
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
