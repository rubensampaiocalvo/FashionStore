const express = require("express");
const cors = require("cors");
require("./config/db");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- PRODUCTOS ---------------- */

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

/* CREAR PRODUCTO (ADMIN) */

app.post("/productos", (req, res) => {

  console.log("Datos recibidos:", req.body)

  const { nombre, descripcion, precio, stock } = req.body;

  if (!nombre || !descripcion || !precio || !stock) {
    return res.status(400).json({ message: "Faltan datos del producto" });
  }

  const sql =
    "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)";

  db.query(sql, [nombre, descripcion, Number(precio), Number(stock)], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error creando producto" });
    }

    res.json({
      message: "Producto creado correctamente",
      id: result.insertId,
    });
  });
});

/* ---------------- API TEST ---------------- */

app.get("/", (req, res) => {
  res.send("API FashionShop funcionando 🚀");
});

/* ---------------- LOGIN / REGISTRO ---------------- */

const bcrypt = require("bcrypt");

app.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const checkSql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(checkSql, [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Error servidor" });

      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";

      db.query(insertSql, [nombre, email, hashedPassword], (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error registrando usuario" });

        res.json({ message: "Usuario registrado correctamente" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

/* ---------------- LOGIN ---------------- */

const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).send("Error en el servidor");
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol },
      "secreto_super_seguro",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login correcto",
      token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  });
});

/* ---------------- SERVER ---------------- */

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
app.delete("/productos/:id", (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM productos WHERE id_producto = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({message:"Error eliminando producto"});
    }

    res.json({message:"Producto eliminado"});
  });

});

app.get("/usuarios", (req, res) => {

  const sql = "SELECT id_usuario, nombre, email, rol FROM usuarios";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json({message:"Error"});
    }

    res.json(result);

  });

});