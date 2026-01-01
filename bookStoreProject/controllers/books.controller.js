const db = require('../db')
const { eq, ilike } = require('drizzle-orm');
const bookTable = require('../models/books.model');
const { sql } = require("drizzle-orm");
exports.getAllBooks = async function (req, res) {
    const search = req.query.search;
    console.log(search);
    if (search) {
        const books = await db.select().from(bookTable)
            .where(sql`to_tsvector('english', ${bookTable.title}) @@ to_tsquery('english', ${search})`);
          
        // using above statement will reduce latency while fetching query
        // by using indexing 

        // .where(ilike(bookTable.title,`%${search}%`))  // ilkie used for filtering data but it will increase query fetch time 
        // performance will get degraded
        
        return res.json(books);
    }
    const books = await db.select().from(bookTable)
    res.json(books)
}

exports.getBookById = async function (req, res) {
    const id = req.params.id;
    const [book] = await db.select().from(bookTable).where(table => eq(table.id, id)).limit(1);

    if (!book) {
        return res.status(404).json({ err: `Book with ${id} not found` })
    }
    return res.json(book);
}

exports.addBook = async function (req, res) {
    const { title, description, authorId } = req.body;
    if (!title || title === '') return res.status(400).json({ err: `title is required` });

    const [result] = await db.insert(bookTable)
        .values({
            title,
            description,
            authorId
        })
        .returning({
            id: bookTable.id
        })

    res.status(201)
        .json({ message: "Books created succcessfully", id: result.id });
}

exports.deleteBookById = async function (req, res) {
    const id = req.params.id;

    await db.delete(bookTable).where(eq(bookTable.id, id));
    return res.status(200).json({ message: "book deleted successfully" });
}
