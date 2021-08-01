import React, { useState } from "react";
import Header from "./Header";
import ProductList from "./ProductList";

const Main = () => {
  const [open, setOpen] = useState(true);
  const [buttonText, setButtonText] = useState("Add Product");

  function activateAddNewWindow() {
    if (!open) {
      console.log(open, "open falsessa");
      setButtonText("Add Product");
      setOpen(true);
    } else {
      console.log(open, "minä täällä tosissa");
      setButtonText("Close");
      setOpen(false);
    }
  }

  return (
    <>
      <div className="main_window_radius">
        <Header headerText="React Electron App" />
        <hr />
        <button type="button" onClick={activateAddNewWindow}>
          {buttonText}
        </button>

        <ProductList />
      </div>
    </>
  );
};

export default Main;
