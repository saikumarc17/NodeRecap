import express from 'express';
import db from '../db/index.js';
import { usersTable, userSessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.patch('/', ensureAuthenticated, async (req, res) => {

    const { name } = req.body;
    await db.update(usersTable).set({ name }).where(eq(usersTable.id, user.id))
    return res.json({ status: 'success' });
})

router.get('/', ensureAuthenticated, async (req, res) => {
    return res.json({ user: req.user });
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
        salt,
        role:usersTable.role
    }).returning({ id: usersTable.id });
    console.log(user);

    return res.status(201).json({ status: 'success', data: { userId: user.id } });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
        return res.status(404).json({ error: 'Invalid user details' });
    }

    const hashedPassword = createHmac('sha256', user.salt).update(password).digest('hex');
    if (hashedPassword !== user.password) {     
        return res.status(401).json({ error: 'Invalid Password' });
    }
    //creating new Session
    const [session] = await db.insert(userSessions).values({
        userId: user.id,
    }).returning({ id: userSessions.id });

    return res.json({ status: 'success', data: { userId: user.id, sessionId: session.id } });
})

router.post('/loginJWT', async (req, res) => {
    const { email, password } = req.body;
    const [user] = await db.select({
        id:usersTable.id,
        email:usersTable.email,
        name:usersTable.name,
        salt:usersTable.salt,
        role:usersTable.role,
        password:usersTable.password
    }).from(usersTable).where(eq(usersTable.email, email));

    if (!user) {
        return res.status(404).json({ error: 'Invalid user details' });
    }

    const hashedPassword = createHmac('sha256', user.salt).update(password).digest('hex');
    if (hashedPassword !== user.password) {
        // console.log(user.password);
        // console.log(hashedPassword);        
        return res.status(401).json({ error: 'Invalid Password' });
    }

    //creating jwt token

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role:user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({ status: 'success', token });
})



export default router;