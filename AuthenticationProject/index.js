import express from 'express';
import userRouter from './routes/user.routes.js';
import db from './db/index.js';
import { usersTable, userSessions } from './db/schema.js';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT ?? 8000;
app.use(express.json());

// this middleware is taking care of session based authentication
app.use('/', async function (req, res, next) {
    console.log(db);

    const sessionId = req.headers['session-id'];
    console.log(sessionId, 'session id in get user');
    if (!sessionId) {
        return next();
    }
    const [data] = await db.select({
        sessionId: userSessions.id,
        id: usersTable.id,
        userId: userSessions.userId,
        name: usersTable.name,
        email: usersTable.email
    }).from(userSessions)
        .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
        .where(table => eq(table.sessionId, sessionId)) //  match session id from headers

    if (!data) {
        return next();
    }
    req.user = data;
    console.log(data, 31);

    next();
})
// this middleware is taking care of session based authentication

app.use('/users', userRouter);

app.get('/', (req, res) => {
    return res.json({ "message": `Server running at started` })
})



app.listen(PORT, () => {
    console.log(`Server Started at localhost:${PORT}`);
})