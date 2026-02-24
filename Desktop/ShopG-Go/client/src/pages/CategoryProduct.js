import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getProductByCat();
    // eslint-disable-next-line
  }, [params?.slug]);

  const getProductByCat = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="container mt-3">
        <h5 class=" text-center"> c {category.name} </h5>
        <h5 className=" text-center">{products?.length} result found</h5>
        <div className="row">
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
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
                      class="btn btn-secondary ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      See Details
                    </button>
                    <button class="btn btn ms-1">Add card</button>
                    <button class="btn btn-primary ms-1">Buy now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className="btn btn-warning " onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}>
                                {loading ? ("Loading...") : (
                                    <>
                                       
                                        Loading. <AiOutlineReload />
                                    </>
                                )}
                            </button>
                        )}
                    </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
