import React from "react";
import "./AuthModal.css";

export const MODAL_TYPES = {
  NONE: "NONE",
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
};

const AuthContainer = ({ initialModal = MODAL_TYPES.NONE, onClose }) => {
  if (initialModal === MODAL_TYPES.NONE) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{initialModal === MODAL_TYPES.LOGIN ? "Login" : "Register"}</h2>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="submit-btn">
            {initialModal === MODAL_TYPES.LOGIN ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthContainer;
