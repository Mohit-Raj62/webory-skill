import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/Search";
import { FcViewDetails } from "react-icons/fc";
import { PiShoppingCartBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const Search = () => {
  const navigate = useNavigate();
  const [values,] = useSearch();
  const [cart, setCart] = useCart();

  return (
    <Layout title={"Search results ROYAL-GLOW"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Result</h1>
          <h6>
            {values?.results.length < 1
              ? "No products Found"
              : `Found${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 25)}</p>
                  <p className="card-text"> ₹ {p.price}</p>
                  <div className="d-flex">
                    <button
                      title="MORE DETAILS"
                      className="btn btn"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      <FcViewDetails />
                    </button>

                    <button className="btn btn-secondary ms-1" title="ADD TO CARD"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem('cart', JSON.stringify([...cart, p]))
                      toast.success('Item added Cart & Buy')
                    }}
                    >
                      <PiShoppingCartBold />
                    </button>
                    <button className="btn btn-primary ms-1"
                     onClick={() => {
                      setCart([...cart, p]);
                      navigate(`/cart`)
                      localStorage.setItem('cart', JSON.stringify([...cart, p]))
                      toast.success('Item added Cart & Buy')
                    }}
                    >
                      Buy now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Search;
