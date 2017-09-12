import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql, gql } from 'react-apollo'
import { Facebook, Google, Twitter } from '../icons'
import Logo from './logo'
import TextField from './text_field'

class LoginForm extends React.Component {
  static propTypes = {
    logIn: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string)
  }

  state = {
    email: '',
    password: '',
    page: 'login',
    loading: false
  }

  render() {
    const { errors = [] } = this.props
    const { email, password, page } = this.state
    const loading = this.state.loading || this.props.loading

    return (
      <div className={classNames('login-form', page, { loading })}>
        <Logo
          loading={loading}
          onClick={() => this.setState({ loading: !loading })}
        />
        <section className="forms" ref={el => this.pages = el}>
          <form
            aria-hidden={page !== 'login'}
            onSubmit={e => this._logIn(e)}
            ref={el => this._resize(el, 'login')}
          >
            {errors.length
              ? errors.map(error => (
                  <p key={error}>
                    {error}
                  </p>
                ))
              : <p>Please log in to continue.</p>}
            <TextField
              label="Email"
              type="email"
              name="email"
              id="login-email"
              value={email}
              required
              onChange={e => this.setState({ email: e.target.value })}
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              id="login-password"
              value={password}
              required
              onChange={e => this.setState({ password: e.target.value })}
            >
              <p className="hint">Forgot your password?</p>
            </TextField>
            <footer className="buttons">
              <button type="submit">Log in</button>
              <span>
                or&nbsp;
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    this.setState({ page: 'register' })
                  }}
                >
                  register
                </a>
              </span>
            </footer>
          </form>
          <form
            aria-hidden={page !== 'register'}
            onSubmit={e => e.preventDefault()}
            ref={el => this._resize(el, 'register')}
          >
            <p>Todo</p>
            <footer className="buttons">
              <button type="submit">Register</button>
              <span>
                or&nbsp;
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    this.setState({ page: 'login' })
                  }}
                >
                  log in
                </a>
              </span>
            </footer>
          </form>
        </section>
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
      </div>
    )
  }

  _logIn = async e => {
    const { email, password } = this.state
    e.preventDefault()
    await this.props.logIn(email, password)
  }

  _resize(el, page) {
    if (el && page === this.state.page) {
      setTimeout(() => {
        this.pages && (this.pages.style.height = `${el.offsetHeight}px`)
      })
    }
  }
}

export default LoginForm
