const { User } = require("../Models/User");
const { Book } = require("../Models/Books");

module.exports= (app) => {
    
  app.get("/books", checkAuthenticated, async (req, res) => {
    try {
      const Books = await Book.create({
        title: "Hello",
        author: "Narayanan",
        category: "NodeJS",
      });
      console.log("Book value Inserted");
    } catch (error) {
      console.log("Book Insertion Error", error);
    }
    const result = await Book.findAll();
    console.log("Result", result);
    res.send(result);
  });

  app.post("/books", async (req, res) => {
    console.log("Books Request", Object.keys(req));
    console.log("Books Request", req.body);

    try {
      const Books = await Book.create({
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
      });
      console.log("Response Books /Post=> ", res.body);
      console.log("Book value Inserted");
      res.send(Books);
    } catch (error) {
      console.log("Insertion Error", error);
    }
  });

  app.get("/books/:id", async (req, res) => {
    console.log("Books Search Request", req.params);
    const ID = req.params.id;
    let isnum = /^\d+$/.test(ID);
    let Books;
    if (!isnum) {
      console.log("ISNUM", isnum);
      res.status(400).send("Invalid ID supplied");
    }
    try {
      Books = await Book.findByPk(ID);
      console.log("Response Books /GET ID => ", Books);
      if (Books === null) {
        res.status(400).send("Book not found");
      }
      res.send(Books);
      console.log("Book value Found");
    } catch (error) {
      console.log("Search Error", error);
      res.send("Book not found");
    }
  });

  app.put("/books/:id", async function (req, res) {
    const ID = req.params.id;
    let Books;
    console.log("Request => ", req.body);
    try {
      Books = await Book.findByPk(ID);
      console.log("Response Books /GET ID => ", Books);
      if (Books === null) {
        res.status(400).send("Book not found");
      }
      let bookUpdate = await Book.update(req.body, {
        where: {
          id: ID,
        },
      });
      res.send(bookUpdate);
      console.log("Book value Found");
    } catch (error) {
      console.log("Search Error", error);
      res.send("Book not found");
    }
  });

  app.delete("/books/:id", async function (req, res) {
    let ID = req.params.id;
    try {
      const Books = await Book.destroy({
        where: {
          id: ID,
        },
      });
      console.log("Book value Deleted", Books);
      await res.send(Books.toString());
    } catch (error) {
      console.log("Deletion Error", error);
    }
  });
}