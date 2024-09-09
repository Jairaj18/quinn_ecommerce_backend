import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from './middlewares/errorHandle.js';
import authRoutes from './routes/auth.routes.js';
import authProduct from './routes/product.routes.js';
import dbConnect from './config/dbConnect.js';
import blogRouter from './routes/blog.routes.js';
import categoryRoutes from './routes/productCategories.routes.js';
import path from 'path';
import morgan from 'morgan';


const app = express();
dotenv.config();

dbConnect();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: '/swagger-output.json'
  }
}));
app.use('/swagger-output.json', express.static(path.resolve('./swagger-output.json')));
app.use(morgan("dev"));

app.use('/api/user', authRoutes);
app.use('/api/product', authProduct);
app.use('/api/blog', blogRouter);
app.use('/api/category',categoryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`Server is running on port ${PORT}`);
});
