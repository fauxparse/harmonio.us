import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

export default ({ loading, onClick }) => {
  return (
    <svg
      className={classNames('logo', { loading })}
      viewBox="0 0 64 64"
      onClick={onClick}
    >
      <circle cx={32} cy={32} r={28} />
      <g className="plus">
        <g><rect x={20} y={20} width={8} height={8} /></g>
        <g><rect x={12} y={28} width={8} height={8} /></g>
        <g><rect x={20} y={28} width={8} height={8} /></g>
        <g><rect x={28} y={28} width={8} height={8} /></g>
        <g><rect x={20} y={36} width={8} height={8} /></g>
      </g>
      <g className="one">
        <rect x={36} y={20} width={8} height={24} />
      </g>
    </svg>
  )
}
