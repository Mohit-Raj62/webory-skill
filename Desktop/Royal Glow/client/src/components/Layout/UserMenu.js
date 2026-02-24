import React from 'react'
import { NavLink } from 'react-router-dom'

const UserMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h4>User Panel</h4>
          <NavLink
            to={"/dashboard/user/profile"}
            className="list-group-item list-group-item-action"
          >
            PROFILE
          </NavLink>
          <NavLink
            to={"/dashboard/user/orders"}
            className="list-group-item list-group-item-action"
          >
            ORDERS
          </NavLink>
          <NavLink
            to={"/dashboard/user/status"}
            className="list-group-item list-group-item-action"
          >
            STATUS
          </NavLink>

          <NavLink
            to={"/dashboard/user/wishCart"}
            className="list-group-item list-group-item-action"
          >
            WISHLIST
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default UserMenu