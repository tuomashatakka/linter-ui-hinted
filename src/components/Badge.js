'use babel'

import React from 'react'
import prop from 'prop-types'

const Badge = ({ text=null }) => {

  Badge.propTypes = {
    text: prop.string,
  }
  
  return <span className='badge'>
    {text}
  </span>
}


export default Badge
