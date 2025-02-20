const AuthProducto = require("../modelo/producto.model");
const { signToken } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { errorMiddleware } = require("../middlewares/errorsManager");
const {
  obtenerTodosLosProductos,
  InsertarProducto,
  obtenerProductoById,
  obtenerProductosByMarca,
  obtenerProductosByTipo,
  obtenerProductosByCuerpo,
  obtenerProductosByUsuario,
  obtenerUltimos5Productos,
} = require("../modelo/producto.model");

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No autorizado. Token no presente." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), String(JWT_SECRET));
    req.user = decoded; // Guardamos los datos decodificados del usuario
    next(); // Continuar con la siguiente función en la ruta
  } catch (error) {
    return res.status(401).json({ error: "No autorizado. Token inválido." });
  }
};

// Obtener todos los producto usuarios
const HandleObtenerProductos = async (req, res) => {
  try {
    const productos = await obtenerTodosLosProductos();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos." });
  }
};

const HandleCrearProducto = async (req, res) => {
  const { id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color } = req.body;

  if (!nombre || !marca || !tipo || !cuerpo || !alto || !ancho || !precio || !foto || !detalle || !stock || !color) {
    return res.status(400).json({ msg: "Los campos obligatorios no pueden estar vacíos." });
  }

  try {
    const response = await InsertarProducto(req.body);
    res.status(201).json({ msg: "Producto creado con éxito!", data: response });
  } catch (error) {
    console.error("Error en HandleCrearProducto:", error.message || error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
// obtener productos por el id_usuario
const HandleObtenerProductosByUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params; 
    const productos = await obtenerProductosByUsuario(id_usuario);

    if (!productos.length) {
      return res.status(404).json({ msg: "No se encontraron productos para este usuario." });
    }

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos del usuario.", error: error.message });
  }
};

//
const HandleObtenerProductosById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await obtenerProductoById(id);

    if (!producto) {
      return res.status(404).json({ msg: "No se encontró el producto con ese ID o el formato es incorrecto." });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error.message);
    res.status(500).json({ msg: "Error interno del servidor.", error: error.message });
  }
};

// Obtener productos por Marca 
const HandleObtenerProductosByMarca = async (req, res) => {
  try {
    const { marca } = req.params;
    const productos = await obtenerProductosByMarca(marca);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos por marca.", error: error.message });
  }
};

// Obtener productos por Tipo 
const HandleObtenerProductosByTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const productos = await obtenerProductosByTipo(tipo);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos por tipo.", error: error.message });
  }
};

// Obtener productos por Cuerpo 
const HandleObtenerProductosByCuerpo = async (req, res) => {
  try {
    const { cuerpo } = req.params;
    const productos = await obtenerProductosByCuerpo(cuerpo);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos por cuerpo.", error: error.message });
  }
};

const HandleObtener5UltimosProductos = async (req, res) => {
  try {
    const productos = await obtenerUltimos5Productos();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en la petición:", error.message);
    res.status(500).json({ msg: "Error al obtener los productos" });
  }
};

module.exports = {
  verificarToken,
  HandleObtenerProductos,
  HandleCrearProducto,
  HandleObtenerProductosById,
  HandleObtenerProductosByMarca,
  HandleObtenerProductosByTipo,
  HandleObtenerProductosByCuerpo,
  HandleObtenerProductosByUsuario,
  HandleObtener5UltimosProductos
};