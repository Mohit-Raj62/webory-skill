import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h4>ADMIN PANEL</h4>
          <NavLink
            to={"/dashboard/admin/category"}
            className="list-group-item list-group-item-action"
          >
            CREATE CATEGORY
          </NavLink>
          <NavLink
            to={"/dashboard/admin/create-product"}
            className="list-group-item list-group-item-action"
          >
            CREATE PRODUCT
          </NavLink>
          <NavLink
            to={"/dashboard/admin/products"}
            className="list-group-item list-group-item-action"
          >
            PRODUCTS
          </NavLink>
          <NavLink
            to={"/dashboard/admin/orders"}
            className="list-group-item list-group-item-action"
          >
            ORDERS
          </NavLink>
          <NavLink
            to={"/dashboard/admin/users"}
            className="list-group-item list-group-item-action"
          >
            USERS ACCOUNT
          </NavLink>
          <NavLink
            to={"/dashboard/admin/contact"}
            className="list-group-item list-group-item-action"
          >
            MESSAGE'S
            
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;