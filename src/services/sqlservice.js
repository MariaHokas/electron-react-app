const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const { ipcMain } = require("electron");

/**
 * Connect to the database
 * @returns 'Promise' A promise object containing an open connection to the database
 */
const connectToServer = () => {
  return new Promise((resolve, reject) => {
    const config = {
      server: process.env.DB_SERVER,
      authentication: {
        type: process.env.DB_AUTHTYPE,
        options: {
          userName: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        },
      },
      options: {
        database: process.env.DB_DBNAME,

        // These two settings are really important to make successfull connection
        encrypt: false,
        trustServerCertificate: false,

        // This will allow you to access the rows returned.
        // See 'doneInProc' event below
        rowCollectionOnDone: true,
      },
    };

    const connection = new Connection(config);

    connection.connect();

    connection.on("connect", function (err) {
      if (err) {
        console.log("Error: ", err);
        reject(err);
      } else {
        // If no error, then good to go...
        console.log("Connection Successful!");
        resolve(connection);
      }
    });

    connection.on("end", () => {
      console.log("Connection Closed!");
    });
  });
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const readFromDb = (connection, sqlQuery) => {
  return new Promise((resolve, reject) => {
    let products = [];

    console.log("Reading rows from the Table...");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = new Request(sqlQuery, (err, rowCount, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log(`${rowCount} row(s) returned`);
        resolve(products);
        connection.close();
      }
    });

    request.on("doneInProc", (rowCount, more, rows) => {
      products = [];
      // eslint-disable-next-line array-callback-return
      rows.map((row) => {
        const result = {};
        // eslint-disable-next-line array-callback-return
        row.map((child) => {
          result[child.metadata.colName] = child.value;
        });
        products.push(result);
      });
    });

    connection.execSql(request);
  });
};

const getProducts = () => {
  return new Promise((resolve, reject) => {
    connectToServer()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((connection) => {
        const sqlStr =
          "SELECT [ProductID], [Name], [ProductNumber] FROM SalesLT.Product order by ProductID DESC";

        return readFromDb(connection, sqlStr);
      })
      .then((products) => resolve(products))
      .catch((err) => reject(err));
  });
};

ipcMain.handle("getproducts", getProducts);

const readOneFromDb = (connection, sqlQuery, productID) => {
  return new Promise((resolve, reject) => {
    let products = [];

    console.log("Reading rows from the Table...");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = new Request(sqlQuery, (err, rowCount, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log(`${rowCount} row(s) returned`);
        resolve(products);
        connection.close();
      }
    });
    request.addParameter("ProductID", TYPES.Int, productID);
    request.on("doneInProc", (rowCount, more, rows) => {
      products = [];
      // eslint-disable-next-line array-callback-return
      rows.map((row) => {
        const result = {};
        // eslint-disable-next-line array-callback-return
        row.map((child) => {
          result[child.metadata.colName] = child.value;
        });
        products.push(result);
      });
    });

    connection.execSql(request);
  });
};

const getOneProducts = (productID) => {
  console.log(`Getting product which ID is '${productID}' from Table...`);
  return new Promise((resolve, reject) => {
    connectToServer()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((connection) => {
        const sqlStr =
          "SELECT [ProductID], [Name], [ProductNumber], [StandardCost], [ListPrice] FROM SalesLT.Product WHERE ProductID  = @ProductID";

        return readOneFromDb(connection, sqlStr, productID);
      })
      .then((products) => resolve(products))
      .catch((err) => reject(err));
  });
};

ipcMain.handle("getOneProducts", async (event, productID) => {
  const result = await getOneProducts(productID);
  return result;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createNewProduct = (data) => {
  return new Promise((resolve, reject) => {
    connectToServer()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((connection) => {
        const request = new Request(
          "INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);",
          // eslint-disable-next-line func-names
          (err) => {
            if (err) {
              reject(err);
            }
          }
        );
        request.addParameter("Name", TYPES.NVarChar, data.name);
        request.addParameter("Number", TYPES.NVarChar, data.number);
        request.addParameter("Cost", TYPES.Int, 11, data.cost);
        request.addParameter("Price", TYPES.Int, 11, data.price);
        console.log(request);
        request.on("row", function (columns) {
          columns.forEach(function (column) {
            if (column.value === null) {
              console.log("NULL");
            } else {
              console.log(`Product id of inserted item is ${column.value}`);
            }
          });
        });
        request.on("requestCompleted", function (rowCount, more) {
          connection.close();
        });
        connection.execSql(request);
        return console.log(`Product id of inserted ${request.name}`);
      })
      .then((products) => resolve(products))
      .catch((err) => reject(err));
  });
};

ipcMain.on("createNewProduct", (event, data) => {
  // eslint-disable-next-line no-console
  console.warn(data);
  createNewProduct(data);
});

const deleteProduct = (productID) => {
  console.log(`Deleting '${productID}' from Table...`);
  return new Promise((resolve, reject) => {
    connectToServer()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((connection) => {
        // Delete the employee record requested
        const request = new Request(
          "DELETE FROM SalesLT.Product WHERE ProductID = @ProductID;",
          (err) => {
            if (err) {
              reject(err);
            }
          }
        );
        request.addParameter("ProductID", TYPES.Int, productID);
        // Execute SQL statement
        connection.execSql(request);
        return console.log(`Product id of deleted ${productID}`);
      })
      .then((products) => resolve(products))
      .catch((err) => reject(err));
  });
};

ipcMain.on("deleteProduct", (event, data) => {
  // eslint-disable-next-line no-console
  console.warn(data);
  deleteProduct(data);
});

// Attempt to connect and execute queries if connection goes through
