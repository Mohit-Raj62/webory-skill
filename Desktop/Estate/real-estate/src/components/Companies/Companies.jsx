import React from "react";
import "./Companies.css";

const Companies = () => {
  return (
    <section className="c-wrapper">
      <div className="paddings innerWidth flexCenter c-container">
        <img src="./prologis.png" alt="Prologis" />
        <img src="./equinix.png" alt="Equinix" />
        <img src="./realty.png" alt="Realty" />
        <img src="./tower.png" alt="Tower" />
      </div>
    </section>
  );
};

export default Companies;
