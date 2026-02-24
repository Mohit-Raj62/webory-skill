import React from "react";
import Layout from "../components/Layout/Layout";

const HomePage = () => {
  return (
    <Layout title={"All Product - ROYAL GLOW"}>
    <div className="row mt-3">
      <div className="col-md-2">
        <h4 className="text-center"> Filter by category</h4>
        <div className="d-flex flex-column">
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
                <Radio value={p.array}>{p.name}</Radio>
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
