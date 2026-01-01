import express from 'express';
import db from '../db/index.js';
import { usersTable,userSessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';


const router = express.Router();

router.get('/', (req, res) => {
    res.send('User route');
})

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const [existingUser] = await db
        .select({
            email: usersTable.email
        })
        .from(usersTable)
        .where((table) => eq(table.email, email));

    if (existingUser) {
        return res.status(400).json({ error: `user with email ${email} already exists!` })
    }

    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')

    const [user] = await db.insert(usersTable).values({
        name,
        email,
        password: hashedPassword,
        salt
    }).returning({ id: usersTable.id });
    console.log(user);
    
    return res.status(201).json({ status: 'success', data: { userId: user.id } });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [user]=await db.select().from(usersTable).where(eq(usersTable.email,email));
    if(!user){
        return  res.status(404).json({error:'Invalid user details'});
    }

    const hashedPassword = createHmac('sha256', user.salt).update(password).digest('hex');
    if(hashedPassword!==user.password){
        // console.log(user.password);
        // console.log(hashedPassword);        
        return res.status(401).json({error:'Invalid Password'});
    }
    //creating new Session
    const [session]=await db.insert(userSessions).values({
        userId:user.id,
    }).returning({id:userSessions.id});

    return res.json({status:'success',data:{userId:user.id,sessionId:session.id}});
})

export default router;