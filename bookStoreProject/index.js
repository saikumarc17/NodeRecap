require('dotenv/config');
const express=require('express');
const bookRouter=require('./routes/book.route');
const authorRouter=require('./routes/author.route')
const {loggerMiddleware}=require('./middlewares/logger');

const app=express();
const PORT=8000;

app.use(express.json());
app.use(loggerMiddleware)

app.use('/books',bookRouter);
app.use('/author',authorRouter);

app.listen(PORT,()=>{
    console.log(`Server started Running at localhost:${PORT}`);
})