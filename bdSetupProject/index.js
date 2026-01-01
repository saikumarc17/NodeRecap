require('dotenv/config');
const db = require("./db");
const { usersTable } = require('./drizzle/schema');

async function getAllUsers() {
    const users = await db.select().from(usersTable);
    console.log(users);
    
    return users;
}

async function createUser({id,name,email}) {
    await db.insert(usersTable).values({
        id,name,email
    });    
}

// createUser({id:1,name:'test1',email:'test1@email.com'});
// createUser({id:2,name:'test2',email:'test2@email.com'});


getAllUsers();


