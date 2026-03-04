import express from "express";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { globalHandler } from "./middlewares/globalHandler.js";
import routesStatic from "./routes/routesStatic.js";
import routesDynamic from "./routes/routesDynamic.js";
import routesCart from "./routes/routesCart.js";
import routesAuth from "./routes/routesAuth.js";
import { cartContext } from "./middlewares/cartContext.js";
import { authContext } from "./middlewares/authContext.js";

// Puerto de escucha de peticiones
const PORT = 3000;

// Iniciar Servidor
const app = express();

// Parsear los datos de un formulario
app.use(express.urlencoded({ extended: false }));

// Middleware para manejo de cookies
app.use(cookieParser("MI_CODIGO_SECRETO"));

// Middleware para archivos estaticos
app.use(express.static("public"));

// Para trabajar con plantillas ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware para usar ejs-layouts
app.use(expressLayouts);
app.set("layout", "layout");

app.use(cartContext);
app.use(authContext);
app.use(globalHandler);

// Rutas
app.use(routesStatic);
app.use(routesDynamic);
app.use("/cart", routesCart);
app.use("/auth", routesAuth); // /auth/signup, /auth/login

// Handler para manejar rutas desconocidas
app.use(notFoundHandler);

// Handler para manejar errores
app.use(errorHandler);

// Escuchamos peticiones del cliente.
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
