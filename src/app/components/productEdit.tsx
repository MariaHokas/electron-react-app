/* eslint-disable promise/always-return */
import React, { ChangeEvent, useEffect, useState } from "react";
import { ipcRenderer as ipc } from "electron";

interface IProduct {
  ProductID?: number;
  Name?: string;
  ProductNumber?: string;
  StandardCost?: number;
  ListPrice?: number;
  productOneQuery: any;
}

const productsFromDB: IProduct[] = [];

// const initialValues: IProduct = {
//   ProductID: 0,
//   Name: "",
//   ProductNumber: "",
//   StandardCost: 0,
//   ListPrice: 0,
//   productOneQuery: [],
// };

const ProductEdit: React.FC<IProduct> = ({ productOneQuery }) => {
  const [product, setProduct] = useState(productsFromDB);

  useEffect(() => {
    setProduct(productOneQuery);
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setProduct((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    ipc.send("updateProduct", product);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {product?.map((pro) => (
          <input
            key={pro.ProductID}
            value={pro.ProductID}
            type="text"
            title="Syötä asiakastunnus"
            placeholder="CustomerID"
            readOnly
          />
        ))}
        {product?.map((pro) => (
          <input
            key={pro.ProductID}
            value={pro.Name}
            type="text"
            name="name"
            onChange={handleChangeName}
          />
        ))}
        {product?.map((pro) => (
          <input
            key={pro.ProductID}
            defaultValue={pro.ProductNumber}
            type="text"
            title="Syötä asiakastunnus"
            placeholder="CustomerID"
            name="number"
            onChange={handleChange}
          />
        ))}
        {product?.map((pro) => (
          <input
            key={pro.ProductID}
            defaultValue={pro.ListPrice}
            type="number"
            title="Syötä asiakastunnus"
            placeholder="CustomerID"
            name="cost"
            onChange={handleChange}
          />
        ))}
        {product?.map((pro) => (
          <input
            key={pro.ProductID}
            defaultValue={pro.StandardCost}
            type="number"
            title="Syötä asiakastunnus"
            placeholder="CustomerID"
            name="price"
            onChange={handleChange}
          />
        ))}
        <br />
        <button type="submit">Talleta muutokset</button>
      </form>
    </>
  );
};

export default ProductEdit;
