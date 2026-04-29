const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "retail_store",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("database Connected");
});

app.post("/suppliers", (req, res) => {
  const { SupplierName, ContactNumber } = req.body;

  const sql =
    "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)";
  connection.query(sql, [SupplierName, ContactNumber], (err, result) => {
    if (err) throw err;
    res.json({ message: "Supplier added", id: result.insertId });
  });
});

app.get("/suppliers", (req, res) => {
  connection.query("SELECT * FROM Suppliers", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/products", (req, res) => {
  const { ProductName, Price, StockQuantity, SupplierID } = req.body;

  const sql = `INSERT INTO Products 
  (ProductName, Price, StockQuantity, SupplierID) 
  VALUES (?, ?, ?, ?)`;

  connection.query(
    sql,
    [ProductName, Price, StockQuantity, SupplierID],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Product added", id: result.insertId });
    },
  );
});
app.get("/products", (req, res) => {
  connection.query("SELECT * FROM Products", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put("/products/:id", (req, res) => {
  const { Price } = req.body;
  const id = req.params.id;
  const sql = "UPDATE Products SET Price = ? WHERE ProductID = ?";
  connection.query(sql, [Price, id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Product updated" });
  });
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM Products WHERE ProductID = ?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "Product deleted" });
  });
});

app.post("/sales", (req, res) => {
  const { ProductID, QuantitySold, SaleDate } = req.body;
  const sql = `INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
  VALUES (?, ?, ?)`;
  connection.query(sql, [ProductID, QuantitySold, SaleDate], (err, result) => {
    if (err) throw err;
    res.json({ message: "Sale added" });
  });
});

app.get("/sales", (req, res) => {
  const sql = `
    SELECT p.ProductName, s.QuantitySold, s.SaleDate
    FROM Sales s
    JOIN Products p ON s.ProductID = p.ProductID
  `;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/total-sales", (req, res) => {
  const sql = `
    SELECT p.ProductName, SUM(s.QuantitySold) AS TotalSold
    FROM Sales s
    JOIN Products p ON s.ProductID = p.ProductID
    GROUP BY p.ProductName
  `;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/highest-stock", (req, res) => {
  const sql = `
    SELECT * FROM Products
    ORDER BY StockQuantity DESC
    LIMIT 1
  `;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
