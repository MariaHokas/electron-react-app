import React from "react";
import Header from "./Header";
import ProductList from "./ProductList";

const Main = () => {
  return (
    <>
      <div className="main_window_radius">
        <Header />
        <hr />
        <ProductList />
      </div>
    </>
  );
};

export default Main;
