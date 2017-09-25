import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Edit, Done } from '../icons'
import TextField from './text_field'

class TeamMember extends React.Component {
  state = {
    editing: false
  }

  render() {
    const {
      data: { loading, team: { member } = {} },
      match: { path }
    } = this.props
    const { editing } = this.state

    return (
      <section className="team-member">
        <header>
          <h2>{member && member.name}</h2>
          {editing ? (
            <button>
              <Done />
            </button>
          ) : (
            <button>
              <Edit />
            </button>
          )}
        </header>
        <section>
          <button onClick={() => this.rename()}>Change</button>
        </section>
      </section>
    )
  }

  rename = async () => {
    const { team, id } = this.props.match.params
    const { client } = this.props
    const name = 'Matt'

    await client.mutate({
      mutation: RENAME_MUTATION,
      variables: { team, id, name },
      update: (store, { data: { renameMember } }) => {
        store.writeFragment({
          id: client.dataIdFromObject(renameMember),
          fragment: TEAM_MEMBER_FRAGMENT,
          data: renameMember
        })
      }
    })
  }
}

const TEAM_MEMBER_FRAGMENT = gql`
  fragment memberDetails on Member {
    id
    name
    slug
    admin
    registered
  }
`

const TEAM_MEMBER_QUERY = gql`
  query TeamMemberQuery($team: String!, $id: String!) {
    team(id: $team) {
      id
      member(id: $id) {
        ...memberDetails
      }
    }
  }
  ${TEAM_MEMBER_FRAGMENT}
`

const RENAME_MUTATION = gql`
  mutation RenameMemberMutation($team: String!, $id: String!, $name: String!) {
    renameMember(team: $team, id: $id, name: $name) {
      id
      name
      slug
      admin
      registered
    }
  }
`

export default withApollo(
  graphql(TEAM_MEMBER_QUERY, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        team: props.match.params.team,
        id: props.match.params.id
      }
    })
  })(TeamMember)
)
