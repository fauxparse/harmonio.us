import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { User as UserIcon } from '../icons'

export default class Avatar extends React.Component {
  render() {
    const { className } = this.props
    return (
      <div className={classNames('avatar', className)}>
        <UserIcon />
      </div>
    )
  }
}
