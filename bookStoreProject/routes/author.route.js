const express = require('express');
const authorsTable=require('../models/author.model')
const db=require('../db')
const {eq}=require('drizzle-orm')
const router = express.Router();

router.get('/',async (req,res)=>{
    const authors=await db.select().from(authorsTable);
    return res.json({authors});
})

router.get('/:id',async (req,res)=>{
    const id=req.params.id;
    const [authors]=await db.select().from(authorsTable).where(eq(authorsTable.id,id));
    if(!authors){
        return res.status(404).json({error:`author not found with id: ${id}`});
    }
    return res.json({authors});
})

router.post('/',async (req,res)=>{
    const {firstName,lastName,email} = req.body;
    const [result]=await db.insert(authorsTable).values({firstName,lastName,email}).returning({id:authorsTable.id});
    return res.status(201).json({message:`author has been created with id: ${result.id}`})
})

module.exports=router;