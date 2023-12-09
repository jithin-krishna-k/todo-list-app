import React from 'react'

const Footer = ({length}) => {
    // const today = new Date()
  return (
    <footer>
      {/* <p>copyRights &copy; {today.getFullYear()}</p> */}
      {length} list {length === 1 ? "item":"items"}
    </footer>
  )
}

export default Footer
