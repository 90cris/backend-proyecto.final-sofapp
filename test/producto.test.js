const request = require("supertest");
const app = require("../src/app"); 

describe("🔹 API Productos", () => {
    let productoID;
    let token;
    beforeAll(async () => {
        const res = await request(app).post("/usuario/login").send({
            email: "marce@gmail.com", 
            pass: "Marce123456", 
        });
        token = res.body.token;
    });

    test("Debe crear un producto", async () => {
      const res = await request(app )

        .post("/producto/agregar")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id_usuario: 1,
          nombre: "sillon Relajante",
          marca: "Rosen",
          tipo: "sillon",
          cuerpo: 1,
          alto: 120,
          ancho: 60,
          precio: 200000,
          foto: "https://example.com/sillon.jpg",
          detalle: "Sillon Relajante  con ajuste lumbar.",
          stock: 5,
          color: "negro",
        });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("msg", "Producto creado con éxito!");
      expect(res.body.data).toHaveProperty("id_producto");
  
      productoID = res.body.data.id_producto;
    });
  
    // **Test: Obtener Productos por Marca**
    test("Debe obtener productos por marca", async () => {
      const res = await request(app ).get("/producto/marca/Rosen");
  
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("marca", "Rosen");
    });
  
    // **Test: Obtener Productos por Tipo**
    test("Debe obtener productos por tipo", async () => {
      const res = await request(app ).get("/producto/tipo/sillon");
  
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("tipo", "sillon");
    });
  
    // **Test: Obtener Productos por Cuerpo**
    test("Debe obtener productos por cuerpo", async () => {
      const res = await request(app ).get("/producto/cuerpo/1");
  
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("cuerpo", 1);
    });
  });