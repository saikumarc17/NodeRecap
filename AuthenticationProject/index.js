import express from 'express';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import { authenticationMiddleWare } from './middlewares/auth.middleware.js';


const app = express();
const PORT = process.env.PORT ?? 8000;
app.use(express.json());

app.use('/',authenticationMiddleWare);

app.use('/users', userRouter);

app.use('/admin',adminRouter);

app.get('/', (req, res) => {
    return res.json({ "message": `Server running at started` })
})



app.listen(PORT, () => {
    console.log(`Server Started at localhost:${PORT}`);
})