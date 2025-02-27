const { DB } = require("../config/db");
const format = require("pg-format");
// const { errorMiddleware } = require("../middlewares/errorsManager");

const obtenerTodosLosProductos = async () => {
  const result = await DB.query("SELECT * FROM productos;");
  return result.rows;
};

const InsertarProducto = async (producto) => {
  const {
    id_usuario,
    nombre,
    marca,
    tipo,
    cuerpo,
    alto, 
    ancho,
    precio,
    foto,
    detalle, 
    stock,
    color,
  } = producto;

  if (
    !nombre || !marca || !tipo || !cuerpo || !alto || !ancho ||
    !precio || !foto || !detalle || !stock || !color
  ) {
    throw new Error("Faltan campos obligatorios para insertar el producto.");
  }

  const result = await DB.query(
    `INSERT INTO productos (id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`,
    [id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color]
  );
  return result.rows[0];
};
// obtener productos por id usuario
const obtenerProductosByUsuario = async (id_usuario) => {
  const { rows } = await DB.query(
    "SELECT * FROM productos WHERE id_usuario = $1;",
    [id_usuario]
  );
  return rows;
};

const obtenerProductoById = async (id) => {
  const productoId = parseInt(id, 10);
  if (isNaN(productoId)) return null; 

  const { rows } = await DB.query("SELECT * FROM productos WHERE id_producto = $1;", [productoId]);
  return rows[0] || null;
};

const obtenerProductosByMarca = async (marca) => {
  const { rows } = await DB.query("SELECT * FROM productos WHERE marca ILIKE  $1;", [marca]);
  return rows;
};

const obtenerProductosByTipo = async (tipo) => {
  const { rows } = await DB.query("SELECT * FROM productos WHERE tipo ILIKE $1;", [tipo]);
  return rows;
};

const obtenerProductosByCuerpo = async (cuerpo) => {
  const { rows } = await DB.query("SELECT * FROM productos WHERE cuerpo = $1;", [cuerpo]);
  return rows;
};

const obtenerUltimos5Productos = async () => {
  try {
    const { rows } = await DB.query(
      "SELECT * FROM productos ORDER BY id_producto DESC LIMIT 5"
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener los últimos 5 productos:", error.message);
    throw new Error("Error al obtener productos");
  }
};

module.exports = {
  obtenerTodosLosProductos,
  InsertarProducto,
  obtenerProductoById,
  obtenerProductosByMarca,
  obtenerProductosByTipo,
  obtenerProductosByCuerpo,
  obtenerProductosByUsuario,
  obtenerUltimos5Productos,
};