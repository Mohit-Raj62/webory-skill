// // import React from 'react'
// import "./Service.css"
// import Services_Data from '../../assets/Services_data.js'
// import arrow from "../../assets/arrow.svg";
// import aboutimg from "../../assets/aboutimg.svg";

// const Service = () => {
//   return (
//     <div id='services' className="services">
//         <div className="services-title">
//             <h1>My Services</h1>
//             <img src={aboutimg} alt="" />
//         </div>
//         <div className="services-container">
//             {Services_Data.map((service, index) => (
//                 <div className="service-format" key={index}>
//                     {/* <h3>{service.s_no}</h3> */}
//                     {/* <h2>{service.s_name}</h2> */}
//                     <p>{service.s_desc}</p>
//                     <div className="services-readmore">
//                         <p>Read More</p>
//                         <img src={arrow} alt="" />
//                     </div>
//                 </div>
//             ) )}
//         </div>
//     </div>
//   )
// }

// export default Service