import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setproduct] = useState({});
  const [relatedProducts, setrelatedProducts] = useState([]);

  // initally p details
  useEffect(() => {
    if (params?.slug) getProduct();
    //eslint-disable-next-line
  }, [params?.slug]);

  // get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );
      setproduct(data.product);
      getSimilarProduct(data?.product._id);
    } catch (error) {
      console.log(error);
    }
  };
  // get similary product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/related-product/${pid}/${cid}`
      );
      setrelatedProducts(data?.products.cid);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"Product Details Mi Zip"}>
      <div className="row container mt-3">
        <div className="col-md-6">
          <img
            src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height={"300px"}
            width={"350px"}
          />
        </div>
        <div className="col-md-6">
          <h1 className="text-center">product details</h1>
          {/* <h5>{product?.category} </h5> */}
          <h4>{product.name}</h4>
          <h5>{product.description}</h5>
          <h4>₹ {product.price}</h4>
          <h6>unit(s):{product.quantity}</h6>
          <button class="btn btn-secondary ms-1">Add card</button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h5>Similar Products</h5>
        {relatedProducts.length < 1 && (
          <p className="text-center">No similar products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`http://localhost:8080/api/v1/product/product-photo/${p?._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 25)}</p>
                <p className="card-text"> ₹ {p.price}</p>
                <div className="d-flex">
                  <button class="btn btn ms-1">Add card</button>{" "}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
