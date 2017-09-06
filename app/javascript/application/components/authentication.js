import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { withApollo, graphql, gql } from 'react-apollo'
import LoginForm from './login_form'

export const SessionShape = PropTypes.shape({
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string
  }),
  logOut: PropTypes.func.isRequired
})

class Authentication extends React.Component {
  static childContextTypes = {
    session: SessionShape
  }

  getChildContext() {
    return {
      session: {
        ...this.props.session,
        logOut: this._logOut
      }
    }
  }

  render() {
    const { loading, session = {}, children } = this.props
    return (
      <div className="authentication">
        {loading
          ? <div className="loading"><span>Loading…</span></div>
          : session.user
              ? children
              : <LoginForm logIn={this._logIn} />}
      </div>
    )
  }

  _logIn = async (email, password) => {
    const { client } = this.props
    client.resetStore()
    await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      update: (store, { data: { logIn } }) => {
        store.writeQuery({
          query: SESSION_QUERY,
          data: { session: logIn }
        })
      }
    })
  }

  _logOut = async () => {
    const { client } = this.props
    await client.mutate({ mutation: LOGOUT_MUTATION })
    client.resetStore()
  }
}

export const SESSION_FRAGMENT = gql`
  fragment SessionData on Session {
    user {
      id
      name
      email
      memberships {
        id
        admin
        team {
          id
          name
          slug
        }
      }
    }
    errors
  }
`

export const SESSION_QUERY = gql`
  query SessionQuery {
    session {
      ...SessionData
    }
  }
  ${SESSION_FRAGMENT}
`

const LOGIN_MUTATION = gql`
  mutation LogInMutation($email:String!, $password:String!) {
    logIn(email: $email, password: $password) {
      ...SessionData
    }
  }
  ${SESSION_FRAGMENT}
`

const LOGOUT_MUTATION = gql`
  mutation LogOutMutation {
    logOut {
      ...SessionData
    }
  }
  ${SESSION_FRAGMENT}
`

export default withApollo(
  graphql(SESSION_QUERY, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data: { loading, session } }) => ({ loading, session })
  })(Authentication)
)
