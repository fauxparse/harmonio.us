import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql, gql } from 'react-apollo'

class LoginForm extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired
  }

  state = {
    email: '',
    password: ''
  }

  render() {
    const { loading } = this.props
    const { email, password } = this.state

    return (
      <div className={classNames('login-form', { loading })}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
          />
        </div>
        <button onClick={() => this._logIn()}>Log in</button>
      </div>
    )
  }

  _logIn = async () => {
    const { email, password } = this.state
    await this.props.logIn({
      variables: { email, password }
    })
  }
}

const LOGIN_MUTATION = gql`
  mutation LogInMutation($email:String!, $password:String!) {
    logIn(email: $email, password: $password) {
      user {
        id
        email
      }
      errors
    }
  }
`

export default graphql(LOGIN_MUTATION, { name: 'logIn' })(LoginForm)
