import React, { useEffect, useState } from "react";
import { ipcRenderer as ipc } from "electron";
import ProductEdit from "./productEdit";
import AddNewProduct from "./AddNewProduct";

interface IProduct {
  Name?: string;
  ProductNumber?: string;
  ProductID?: number;
}

const productsFromDB: IProduct[] = [];

const ProductList = () => {
  const [products, setProducts] = useState(productsFromDB);
  const [productOneQuery, setProductOneQuery] = useState();
  const [show, showProducts] = useState(false);
  const [openEdit, SetOpenEdit] = useState(false);
  const [query, setQuery] = useState(false);
  const [buttonText, setButtonText] = useState("Add Product");

  const activateAddNewWindow = () => {
    if (!show) {
      showProducts(true);
      setButtonText("Add Product");
    } else {
      showProducts(false);
      setButtonText("Close");
    }
  };

  useEffect(() => {
    ipc.invoke("getproducts").then((product) => {
      setProducts(product);
      showProducts(true);
    });
    setQuery(true);
    return () => {
      ipc.removeAllListeners("getproducts");
    };
  }, [query]);

  const handleDelete = (productID: number | undefined) => {
    ipc.send("deleteProduct", productID);
    setQuery(false);
    return console.log("tämä", query);
  };

  const handleEdit = (productID: number | undefined): void => {
    SetOpenEdit(true);
    console.log(productID);
    ipc.invoke("getOneProducts", productID).then((oneProduct) => {
      setProductOneQuery(oneProduct);
      showProducts(false);
    });
  };
  if (products.length > 0)
    return (
      <div>
        <button type="button" onClick={activateAddNewWindow}>
          {buttonText}
        </button>
        {!show ? (
          <AddNewProduct
            showProducts={showProducts}
            setButtonText={setButtonText}
            setQuery={setQuery}
          />
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
