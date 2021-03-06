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

  state = {
    loading: true
  }

  getChildContext() {
    return {
      session: {
        ...this.props.session,
        logOut: this._logOut
      }
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 1000)
  }

  render() {
    const { session: { user, errors } = {}, children } = this.props
    const loading = this.props.loading || this.state.loading
    return (
      <div className="authentication">
        {user
          ? children
          : <LoginForm
              logIn={this._logIn}
              register={this._register}
              resetPassword={this._resetPassword}
              loading={loading}
              errors={errors}
            />}
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

  _register = async (name, email, password) => {
    const { client } = this.props
    client.resetStore()
    await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: { name, email, password },
      update: (store, { data: { register } }) => {
        store.writeQuery({
          query: SESSION_QUERY,
          data: { session: register }
        })
      }
    })
  }

  _resetPassword = async (email) => {
    const { client } = this.props
    await client.mutate({
      mutation: RESET_PASSWORD_MUTATION,
      variables: { email },
      update: (store, { data: { resetPassword } }) => {
        store.writeQuery({
          query: SESSION_QUERY,
          data: { session: resetPassword }
        })
      }
    })
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

const REGISTER_MUTATION = gql`
  mutation RegisterMutation($name:String!, $email:String!, $password:String!) {
    register(name: $name, email: $email, password: $password) {
      ...SessionData
    }
  }
  ${SESSION_FRAGMENT}
`

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($email:String!) {
    resetPassword(email: $email) {
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
