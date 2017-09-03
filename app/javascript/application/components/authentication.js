import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql, gql } from 'react-apollo'
import LoginForm from './login_form'

class Authentication extends React.Component {
  static propTypes = {}

  render() {
    const { data: { loading, session = {} }, children } = this.props
    return (
      <div className="authentication">
        {session.user ? children : <LoginForm loading={loading} />}
      </div>
    )
  }
}

const SESSION_QUERY = gql`
  query SessionQuery {
    session {
      user {
        id
        email
      }
    }
  }
`

export default graphql(SESSION_QUERY)(Authentication)
