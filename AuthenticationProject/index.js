import express from 'express';
import userRouter from './routes/user.routes.js'
const app=express();
const PORT=process.env.PORT ?? 8000;
app.use(express.json());


app.get('/',(req,res)=>{
    return res.json({"message":`Server running at started`})
})

app.use('/users',userRouter);

app.listen(PORT,()=>{
    console.log(`Server Started at localhost:${PORT}`);
})