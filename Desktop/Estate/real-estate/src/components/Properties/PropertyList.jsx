import React from "react";
import "./PropertyList.css";
import { useProperty } from "../../context/PropertyContext";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

const PropertyList = () => {
  const { properties } = useProperty();

  return (
    <section className="property-list">
      <div className="container">
        <div className="properties-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <div className="property-image">
                <img src={property.image} alt={property.title} />
                <div className="property-tag">For Sale</div>
              </div>

              <div className="property-info">
                <h3 className="property-name">{property.title}</h3>
                <div className="property-price">
                  <span>₹</span>
                  {(property.price / 100000).toFixed(1)}L
                </div>

                <div className="property-location">
                  <FaMapMarkerAlt />
                  <span>{property.location}</span>
                </div>

                <div className="property-features">
                  <div>
                    <FaBed />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div>
                    <FaBath />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div>
                    <FaRulerCombined />
                    <span>{property.area} sq.ft</span>
                  </div>
                </div>

                <p className="property-detail">{property.description}</p>

                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyList;
