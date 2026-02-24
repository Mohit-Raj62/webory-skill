import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
// import Status from './Status';

const Status = () => {
  const [status, setStatus] = useState([]);
  //eslint-disable-next-line
  const [auth, setAuth] = useAuth();

  const getStatus = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/auth/message`
      );
      setStatus(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getStatus();
  }, [auth?.token]);
  return (
    <Layout title={"Status - ROYAL GLOW"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9 ">
            <h1 className="text-center title">MESSAGE STATUS</h1>
            {status?.map((s) => { 
              return (
                <div className="border shadow">
                  <h2 className="text-center title p-3 m-3 ">
                    IN Process Your Message's Reply will be soon...{" "}
                  </h2>
                </div>
              );
            })}
            {/* <p>{JSON.stringify(status, null, 4)}</p> */}
            <h2 className="text-center title p-3 m-3 ">
              IN Process Your Message's Reply wiil be soon...{" "}
            </h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Status;
