// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout/Layout";
// import { useAuth } from "../context/auth";
// import axios from "axios";

// const HomePage = () => {
//   const [auth, setAuth] = useAuth();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);

//   // get products
//   const getAllProducts = async () => {
//     try {
//       // setLoading(true);
//       const { data } = await axios.get(
//         `http://localhost:8080/api/v1/product/get-product`
//       );
//       // setLoading(false);
//       setProducts(data.products);
//     } catch (error) {
//       // setLoading(false);
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   return (
//     <Layout title={"HOME - ROYAL GLOW"}>
//       <div className="row">
//         <div className="col-md-3">
//           <h4 className="text-center"> Filter by Category</h4>
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center">All Products</h1>
//           <div className="d-flex flex-wrap">
//             {products?.map((p) => (
//               <div className="card m-2" style={{ width: "18rem" }}>
//                 <img
//                   src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
//                   className="card-img-top"
//                   alt={p.name}
//                 />
//                 <div className="card-body">
//                   <h4 className="card-title"><h6> <b>{p.name}</b> {p.description}</h6></h4>
//                     <h6 className="card-title">₹ {p.price}</h6>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { AiOutlineReload, AiOutlineHeart } from "react-icons/ai";
import { FcViewDetails } from "react-icons/fc";
import { MdLockReset } from "react-icons/md";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import { useWishCart } from "../context/wishCard";
import toast from "react-hot-toast";
import "../styles/homestyles.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [wishCart, setWishCart] = useWishCart();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(1);

  // get categories all
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  // get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
    //eslint-disable-next-line
  }, [page]);
  // loading functionality
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // filter products
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
    //eslint-disable-next-line
  }, [checked.length, radio.length]);
  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    // eslint-disable-next-line
  }, [checked, radio]);

  // get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/filters-product",
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Product - ROYAL GLOW"}>
      <div className="row mt-3">
        <div className="col-md-2">
          <h4 className="text-center"> Filter by category</h4>
          <div className="d-flex flex-row">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* prise filter */}
          <h4 className="text-center mt-4"> Filter by Prices</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>
                    {p.name}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="text-center mt-4">
            <button
              title="REFRESH <MdLockReset/> "
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              <MdLockReset />
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center"> All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body ">
                  <h5 className="card-title">
                    <b> {p.name}</b>
                    <button
                      className="btn ms-1"
                      onClick={() => {
                        setWishCart([...wishCart, p]);
                        localStorage.setItem(
                          "wishCart",
                          JSON.stringify([...wishCart, p])
                        );
                        toast.success("Item added wishcart");
                      }}
                    >
                      <AiOutlineHeart />
                    </button>
                  </h5>
                  <h6> {p.description.substring(0, 25)} ...</h6>
                  <h6 className="card-title">₹ {p.price}</h6>
                  <div className="d-flex">
                    <button
                      title="MORE DETAILS"
                      className="btn btn"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      <FcViewDetails />
                    </button>
                    <button
                      className="btn btn-secondary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item added cart");
                      }}
                    >
                      Add card
                    </button>

                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        navigate(`/cart`);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item added Cart & Buy");
                      }}
                    >
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning "
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Loading. <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
