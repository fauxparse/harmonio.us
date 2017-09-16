import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Edit, Done } from '../icons'
import TextField from './text_field'

class TeamMember extends React.Component {
  state = {
    editing: false
  }

  render() {
    const { data: { loading, member }, match: { path } } = this.props
    const { editing } = this.state

    return (
      <section className="team-member">
        <header>
          <h2>{member && member.name}</h2>
          {editing ? <button><Done /></button> : <button><Edit /></button>}
        </header>
        <section>
        </section>
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
