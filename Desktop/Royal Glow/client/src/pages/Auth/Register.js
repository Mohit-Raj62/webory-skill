import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
// useLocation import { useAuth } from "../../context/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  // const [auth, setAuth] = useAuth();
  // const location = useLocation();

  //  form functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, last, email, password, phone, address, answer }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Register Royal Glow"}>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInputName"
              placeholder="First Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="last"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              className="form-control"
              id="exampleInputName"
              placeholder="Last Name"
              required
            />
          </div>

          {/* <div class="container">
      <div class="form-container">
        <label class="form-row">
          <input
            autocomplete="one-time-code"
            type="text"
            id="name"
            name="name"
            placeholder="name"
            required
          />
        </label> */}

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputPhone"
              placeholder="Enter Mobile phone number"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputName"
              placeholder="Enter your address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputName"
              placeholder="What is your favorite movies"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default Register;

// // export default Register;
// import React, { useState } from "react";
// import Layout from "../../components/Layout/Layout";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import "../../styles/AuthStyles.css";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [last, setLast] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState();
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [answer, setAnswer] = useState("");
//   const navigate = useNavigate();
//   // const [auth, setAuth] = useAuth();
//   // const location = useLocation();

//   //  form functions
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API}/api/v1/auth/register`,
//         { name, last, email, password, phone, address, answer }
//       );
//       if (res.data.success) {
//         toast.success(res.data.message);
//         navigate("/login");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };
//   return (
//     <Layout title={"Register Royal Glow"}>

//         <section className="vh-100 gradient-custom">
//           <div className="container py-5 h-100">
//             <div className="row justify-content-center align-items-center h-100">
//               <div className="col-12 col-lg-9 col-xl-7">
//                 <div
//                   className="card shadow-2-strong card-registration"
//                   style={{ borderRadius: 15 }}
//                 >
//                   <div className="card-body p-4 p-md-5">
//                     <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">
//                       Registration Form
//                     </h3>
//                     <form onSubmit={handleSubmit}>
//                       <div className="row">
//                         <div className="col-md-6 mb-4">
//                           <div data-mdb-input-init="" className="form-outline">
//                             <input
//                               type="text"
//                               id="firstName"
//                               className="form-control form-control-lg"
//                               onChange={(e) => setName(e.target.value)}
//                             />
//                             <label className="form-label" htmlFor="firstName">
//                               First Name
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-4">
//                           <div data-mdb-input-init="" className="form-outline">
//                             <input
//                               type="text"
//                               id="lastName"
//                               className="form-control form-control-lg"
//                               onChange={(e) => setLast(e.target.value)}
//                             />
//                             <label className="form-label" htmlFor="lastName">
//                               Last Name
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6 mb-4 d-flex align-items-center">
//                           <div
//                             data-mdb-input-init=""
//                             className="form-outline datepicker w-100"
//                           >
//                             <input
//                               type="password"
//                               className="form-control form-control-lg"
//                               id="birthdayDate"
//                               onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <label
//                               htmlFor="birthdayDate"
//                               className="form-label"
//                             >
//                               Password
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-4">
//                           <h6 className="mb-2 pb-1">Gender: </h6>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="inlineRadioOptions"
//                               id="femaleGender"
//                               defaultValue="option1"
//                               defaultChecked=""
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="femaleGender"
//                             >
//                               Female
//                             </label>
//                           </div>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="inlineRadioOptions"
//                               id="maleGender"
//                               defaultValue="option2"
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="maleGender"
//                             >
//                               Male
//                             </label>
//                           </div>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="inlineRadioOptions"
//                               id="otherGender"
//                               defaultValue="option3"
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="otherGender"
//                             >
//                               Other
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-md-6 mb-4 pb-2">
//                           <div data-mdb-input-init="" className="form-outline">
//                             <input
//                               type="email"
//                               id="emailAddress"
//                               className="form-control form-control-lg"
//                               onChange={(e) => setEmail(e.target.value)}
//                             />
//                             <label
//                               className="form-label"
//                               htmlFor="emailAddress"
//                             >
//                               Email
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-md-6 mb-4 pb-2">
//                           <div data-mdb-input-init="" className="form-outline">
//                             <input
//                               type="tel"
//                               id="phoneNumber"
//                               className="form-control form-control-lg"
//                               onChange={(e) => setPhone(e.target.value)}
//                             />
//                             <label className="form-label" htmlFor="phoneNumber">
//                               Phone Number
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-12">
//                           <select className="select form-control-lg">
//                             <option value={1} disabled="">
//                               Choose option
//                             </option>
//                             <option value={2}>Subject 1</option>
//                             <option value={3}>Subject 2</option>
//                             <option value={4}>Subject 3</option>
//                           </select>
//                           <label className="form-label select-label">
//                             Choose option
//                           </label>
//                         </div>
//                       </div>
//                       <div className="mt-4 pt-2">
//                         <input
//                           data-mdb-ripple-init="s"
//                           className="btn btn-primary btn-lg"
//                           type="submit"
//                           defaultValue="submit"
//                         />
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//     </Layout>
//   );
// };
// export default Register;
