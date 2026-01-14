import { uuid,text, pgTable, varchar,timestamp,pgEnum } from "drizzle-orm/pg-core";

export const userRole=pgEnum('user_role',['USER','ADMIN']);
export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role:userRole().notNull().default('USER'),
    password: text().notNull(),
    salt: text().notNull()
});

export const userSessions=pgTable('user_Session',{
    id:uuid().primaryKey().defaultRandom(),
    userId:uuid().references(()=>usersTable.id).notNull(), //foreign key reference to users table
    createdAt:timestamp().defaultNow().notNull()
})

