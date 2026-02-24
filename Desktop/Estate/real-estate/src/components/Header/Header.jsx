import React from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
// import { motion } from 'framer-motion'
import OutsideClickHandler from "react-outside-click-handler";
import logoImage from "../../assets/agreement.svg";

import AuthContainer, { MODAL_TYPES } from "../Auth/AuthContainer";
import { useUser } from "../../context/UserContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [authModal, setAuthModal] = React.useState(MODAL_TYPES.NONE);
  const { user, logout } = useUser();

  const getMenuStyle = (menuOpen) => {
    if (document.documentElement.clientWidth <= 800) {
      return { right: !menuOpen && "-100%" };
    }
  };

  const closeAuthModal = () => {
    setAuthModal(MODAL_TYPES.NONE);
  };

  return (
    <section className="h-wrapper">
      <div className="flexCenter padding innerWidth h-container">
      
        {/* <img src={logoImage} alt="logo" height={40} /> */}
        {/* <div><p>HARMONY</p> </div> */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpen(false);
          }}
        >
          <div className="flexCenter h-menu" style={getMenuStyle(menuOpen)}>
            <a href="#residencies">Residencies</a>
            <a href="#value">Our Value</a>
            <a href="#contact">Contact Us</a>
            <a href="#get-started">Get Started</a>

            {user ? (
              <div className="user-profile">
                <span className="user-name">{user.name}</span>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  className="login-btn"
                  onClick={() => setAuthModal(MODAL_TYPES.LOGIN)}
                >
                  Login
                </button>
                <button
                  className="register-btn"
                  onClick={() => setAuthModal(MODAL_TYPES.REGISTER)}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </OutsideClickHandler>
        <div className="menu-icon" onClick={() => setMenuOpen((prev) => !prev)}>
          <BiMenuAltRight size={30} />
        </div>
      </div>

      <AuthContainer initialModal={authModal} onClose={closeAuthModal} />
    </section>
  );
};

export default Header;
