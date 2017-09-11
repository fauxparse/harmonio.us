import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql, gql } from 'react-apollo'
import { Facebook, Google, Twitter } from '../icons'
import Logo from './logo'

class LoginForm extends React.Component {
  static propTypes = {
    logIn: PropTypes.func.isRequired,
    loading: PropTypes.bool
  }

  state = {
    email: '',
    password: '',
    loading: false
  }

  render() {
    const { email, password } = this.state
    const loading = this.state.loading || this.props.loading

    return (
      <div className={classNames('login-form', { loading })}>
        <Logo
          loading={loading}
          onClick={() => this.setState({ loading: !loading })}
        />
        <section>
          <form onSubmit={e => this._logIn(e)}>
            <p>
              Please log in to continue.
            </p>
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
            <button type="submit">Log in</button>
          </form>
          <section className="oauth">
            <p>…or log in with</p>
            <ul>
              <li>
                <a
                  rel="facebook"
                  href="/auth/facebook"
                  title="Log in with Facebook"
                >
                  <Facebook />
                </a>
              </li>
              <li>
                <a rel="google" href="/auth/google" title="Log in with Google">
                  <Google />
                </a>
              </li>
              <li>
                <a rel="twitter" href="/auth/twitter" title="Log in with Twitter">
                  <Twitter />
                </a>
              </li>
            </ul>
          </section>
        </section>
      </div>
    )
  }

  _logIn = async e => {
    const { email, password } = this.state
    e.preventDefault()
    await this.props.logIn(email, password)
  }
}

export default LoginForm
