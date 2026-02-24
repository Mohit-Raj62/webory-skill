import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useWishCart } from "../../context/wishCard";
import { useAuth } from "../../context/auth";
// import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import axios from "axios";
import UserMenu from "../../components/Layout/UserMenu";

const Wishlist = () => {
  const [wishCart, setWishCart] = useWishCart();
  //eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  // const navigate = useNavigate();
  //eslint-disable-next-line
  const [wishcart, setWishcart] = useState([]);

  const getWishlist = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/auth/wishlist`
      );
      setWishcart(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getWishlist();
  }, [auth?.token]);

  //detele item wishlist
  const removeCartItem = (pid) => {
    try {
      let myCart = [...wishCart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setWishCart(myCart);
      localStorage.setItem("wishCart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"wishlist - ROYAL GLOW"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9 ">
            <h1 className="text-center title ">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h3 className="text-center">
              {wishCart?.length
                ? `You Have ${wishCart.length} item your wishlist ${
                    auth?.token ? "" : "please login to Checkout !"
                  }`
                : " Your WishCart Is Empty "}
            </h3>
            <div className="card d-flex flex-wrap">
              {wishCart?.map((p) => {
                return (
                  <div className="border shadow ">
                    <div className="container">
                      <div className="col-md-9 ">
                        <div className="row card flex-row">
                          <div className=" col-md-4 mt-3 display-flex">
                            <img
                              src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                              className="card-img-top"
                              alt={p.name}
                              width="100%"
                              height={"130px"}
                            />
                          </div>
                          <div className="col-md-8 mt-2">
                            <p>{p.name}</p>
                            <p>{p.description.substring(0, 15)}...</p>
                            <p> ₹ : {p.price} dis </p>
                          </div>
                        </div>{" "}
                        <button
                          className="btn btn-danger"
                          onClick={() => removeCartItem(p._id)}
                        >
                          Remove
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
                          Add to Card
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
