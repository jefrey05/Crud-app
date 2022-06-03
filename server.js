console.log("may node with you");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000;
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://jefrey:WesY9WgZTALaXuIY@cluster0.wbxv0.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectionString, (err, client) => {
  if (err) return console.err(err);
  console.log("Connected to Database");
  const db = client.db("star-wars-quotes");
  const quotesCollection = db.collection("quotes");
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    db.collection("quotes").find().toArray();
    quotesCollection
      .find()
      .toArray()
      .then((results) => {
        //console.log(results)
        res.render("index.ejs", { quotes: results });
      })
      .catch((error) => console.log(error));
  });

  app.post("/quotes", (req, res) => {
    // console.log(req.body)
    quotesCollection
      .insertOne(req.body)
      .then((result) => {
        //console.log(result)
        res.redirect("/");
      })
      .catch((error) => console.log(error));
  });

  app.put("/quotes", (req, res) => {
    quotesCollection
      .findOneAndUpdate(
        { name: "Yoda" },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote,
          },
        },
        {
          upsert: true,
        }
      )
      .then((result) => {
        //console.log(result)
        res.json("success");
      })
      .catch((error) => console.log(error));
  });

  app.delete("/quotes", (req, res) => {
    quotesCollection
      .deleteOne({ name: req.body.name })
      .then((result) => {
        //res.json("Deleted Darth Vader's quotes")
        if (result.deletedCount === 0) {
          return res.json("No quote to delete");
        }
        res.json("Delete Darth Vader's quote");
      })
      .catch((error) => console.log(error));
  });
  app.listen(process.env.PORT || PORT,()=>{
    console.log(`The server is running on ${PORT}!`)
})
});
