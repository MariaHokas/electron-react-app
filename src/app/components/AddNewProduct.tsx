import React, { ChangeEvent, useRef, useState } from "react";
import { ipcRenderer as ipc } from "electron";

interface InitialValuesProduct {
  name?: string;
  number?: string;
  cost?: number;
  price?: number;
}
interface NewProductProps extends InitialValuesProduct {
  showProducts: (showProducts: boolean) => void;
  setButtonText: (setButtonText: string) => void;
  setQuery: (setQuery: boolean) => void;
}

const initialValues: InitialValuesProduct = {
  name: "",
  number: "",
  cost: 0,
  price: 0,
};

const AddNewProduct: React.FC<NewProductProps> = ({
  showProducts,
  setButtonText,
  setQuery,
}) => {
  const [product, setProduct] = useState<InitialValuesProduct>(initialValues);
  const inputRef = useRef<HTMLInputElement>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    ipc.send("createNewProduct", product);
    setButtonText("Add Product");
    setQuery(false);
    showProducts(true);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Name"
            value={product?.name}
            name="name"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Product Number"
            value={product?.number}
            name="number"
            onChange={handleChange}
            onClick={focus}
          />
          <input
            type="number"
            placeholder="Cost"
            value={product?.cost}
            name="cost"
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Price"
            value={product?.price}
            name="price"
            onChange={handleChange}
            onClick={focus}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default AddNewProduct;
