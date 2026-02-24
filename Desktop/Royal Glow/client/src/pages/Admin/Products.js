import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Products = () => {
  // const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // get all product
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/get-product"
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong product");
    }
  };
  // lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"products ROYAL GLOW"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">ALL Products List </h1>
            <div className="card d-flex flex-wrap">
              {products?.map((p) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        <b>{p.name}</b>
                      </h5>
                      <h6 className="card-title">{p.description}</h6>
                      <h6 className="card-title">₹ {p.price}</h6>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
