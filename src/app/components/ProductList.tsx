import React, { useEffect, useState } from "react";
import { ipcRenderer as ipc } from "electron";
import ProductEdit from "./productEdit";

interface IProduct {
  Name?: string;
  ProductNumber?: string;
  ProductID?: number;
}

const productsFromDB: IProduct[] = [];

const ProductList = () => {
  const [show, showProducts] = useState(false);
  const [openEdit, SetOpenEdit] = useState(false);
  const [products, setProducts] = useState(productsFromDB);
  const [productOneQuery, setProductOneQuery] = useState();
  const [query, setQuery] = useState(false);

  useEffect(() => {
    ipc.invoke("getproducts").then((product) => {
      setProducts(product);
      console.log("ykkonen", product);
      showProducts(true);
    });
    setQuery(true);
    return () => {
      ipc.removeAllListeners("getproducts");
    };
  }, [query]);

  function handleDelete(productID: number | undefined) {
    ipc.send("deleteProduct", productID);
    setQuery(false);
    return console.log("tämä", query);
  }

  function handleEdit(productID: number | undefined): void {
    SetOpenEdit(true);
    console.log(productID);
    ipc.invoke("getOneProducts", productID).then((oneProduct) => {
      setProductOneQuery(oneProduct);
      console.log("oneproduct listasta", oneProduct);

      showProducts(false);
    });
  }

  if (products.length > 0)
    return (
      <div>
        {!show ? (
          "loading "
        ) : (
          <table>
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Product Number</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.ProductID}>
                  <td>
                    <button
                      value={product.ProductID}
                      onClick={() => handleEdit(product.ProductID)}
                      type="button"
                    >
                      Edit
                    </button>
                  </td>
                  <td>{product.Name}</td>
                  <td>{product.ProductNumber}</td>
                  <td>
                    <button
                      name="productID"
                      value={product.ProductID}
                      onClick={() => handleDelete(product.ProductID)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {openEdit ? <ProductEdit productOneQuery={productOneQuery} /> : null}
      </div>
    );
  if (openEdit)
    return (
      <>
        <ProductEdit productOneQuery={productOneQuery} />
      </>
    );

  return (
    <>
      <p>Sorry I did not find anything..</p>
    </>
  );
};

export default ProductList;
