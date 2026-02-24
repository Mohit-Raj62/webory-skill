import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const Pagenotfound = () => {
  return (
    <Layout title={"404 ! Royal Glow"}>
      <div className="pnf">
        <h1 className="pnf-title">404 image </h1>
        <h2 className="pnf-heading">
          Oops ! The page you are looking for does not exist.
        </h2>
        <Link to="/" className="pnf-btn">
          Go Back
        </Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
