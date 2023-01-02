const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.yw8lqr5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const toDoCollection = client.db("myToDo").collection("todolist");

    app.get("/todo-list", async (req, res) => {
      const query = {};
      const results = await toDoCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(results);
    });

    app.post("/todo-list-up", async (req, res) => {
      const toDoItem = req.body;
      const result = await toDoCollection.insertOne(toDoItem);
      res.send(result);
    });

    app.put("/todo-list-up-status/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      console.log(data, filter, options);
      const updatedDoc = {
        $set: {
          status: data.status,
          completedDate: data.date,
        },
      };

      const result = await toDoCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/todo-list-delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const result = await toDoCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
};
run();

app.get("/", (req, res) => {
  res.send("=============== ToDo server is running ===============");
});

app.listen(port, () => {
  console.log(`todo server listening on port ${port}`);
});
