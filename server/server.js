const express = require("express");
const cors = require("cors");
require("./config/db");   
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error obteniendo productos");
      return;
    }
    res.json(result);
  });
});

app.get("/", (req, res) => {
  res.send("API FashionShop funcionando 🚀");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});