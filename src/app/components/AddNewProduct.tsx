import React, { ChangeEvent, useState } from "react";
import { ipcRenderer as ipc } from "electron";

interface InitialValuesProduct {
  name?: string;
  number?: string;
  cost?: number;
  price?: number;
}
interface NewProductProps extends InitialValuesProduct {
  setOpen: (setOpen: boolean) => void;
}

const initialValues: InitialValuesProduct = {
  name: "",
  number: "",
  cost: 0,
  price: 0,
};

const AddNewProduct: React.FC<NewProductProps> = ({ setOpen }) => {
  const [product, setProduct] = useState(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    ipc.send("createNewProduct", product);
    setOpen(true);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
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
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default AddNewProduct;
