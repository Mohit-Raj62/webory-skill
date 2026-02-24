import React from "react";

const Footer = () => {
  return (
    <>
      <div className="container-fluid ">
        <div className="card">
          <div className="heading text-center">
            <div className="head1">S G ENTERPRISES</div>
            <p className="bdr" />
          </div>
          <div className="card-body ">
            <div className="row m-0 pt-5 ">
              <div className="card col-12 col-md-3">
                <div className="card-content ">
                  <i className="fas fa-hand-holding-usd fa-3x " />
                  <div className="card-title">RECHARGE REPEAT CUSTOMER</div>
                  <p>
                    <small>Save customers' cards for future phone orders</small>
                  </p>
                  <div className="learn-more">
                    <p>
                      <small>
                        LEARN MORE
                        <label>
                          <i className="fas fa-angle-right" />
                        </label>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card col-12 col-md-3">
                <div className="card-content">
                  <i className="far fa-handshake fa-3x" />
                  <div className="card-title">ACCEPT ELECTRONIC CHECK</div>
                  <p>
                    <small>Save customers' cards for future phone orders</small>
                  </p>
                  <div className="learn-more">
                    <p>
                      <small>
                        LEARN MORE
                        <label>
                          <i className="fas fa-angle-right" />
                        </label>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card col-12 col-md-3">
                <div className="card-content">
                  <i className="fas fa-mobile-alt fa-3x" />
                  <div className="card-title">STREAMLINE PHONE PAYMENTS</div>
                  <p>
                    <small>Save customers' cards for future phone orders</small>
                  </p>
                  <div className="learn-more">
                    <p>
                      <small>
                        LEARN MORE
                        <label>
                          <i className="fas fa-angle-right" />
                        </label>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
              <div className="card col-12 col-md-3">
                <div className="card-content">
                  <i className="fas fa-user-secret fa-3x" />
                  <div className="card-title">
                    STAY
                    <br />
                    SECURE
                  </div>
                  <p>
                    <small>Save customers' cards for future phone orders</small>
                  </p>
                  <div className="learn-more">
                    <p>
                      <small>
                        LEARN MORE
                        <label>
                          <i className="fas fa-angle-right" />
                        </label>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer row m-0">
            <p>
              <label>
                <i className="fas fa-phone fa-rotate-90 text-primary" />
              </label>
              800-601-0230
            </p>
            <div>
              <p>
                <small className="follow-text">FOLLOW US ON SOCIAL MEDIA</small>{" "}
                <label className="footer-right">
                  <i className="fab fa-instagram" />
                  <i className="fab fa-facebook-square" />
                  <i className="fab fa-linkedin" />
                  <i className="fab fa-twitter-square" />
                </label>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
