import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'

class TeamMember extends React.Component {
  render() {
    const { data: { loading, member }, match: { path } } = this.props

    return (
      <section className="team-member">
        <h1>{member && member.name}</h1>
      </section>
    )
  }
}

const TEAM_MEMBER_QUERY = gql`
  query TeamMemberQuery($team: String!, $id: String!) {
    member(team: $team, id: $id) {
      id
      name
      slug
      admin
      registered
    }
  }
`

export default graphql(TEAM_MEMBER_QUERY, {
  options: props => ({
    notifyOnNetworkStatusChange: true,
    variables: {
      team: props.match.params.team,
      id: props.match.params.id
    }
  })
})(TeamMember)
