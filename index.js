const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json())
const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get Books API
app.get("/register/", async (request, response) => {
  const getUsersQuery = `
    SELECT
      *
    FROM
      user
    ORDER BY
      user_id;`;
  const usersArray = await db.all(getUsersQuery);
  response.send(usersArray);
});


app.get("/register/:userId/",async (request, response) => {
     const {userId} = request.params;
    const getUserQuery = `
    SELECT
      *
    FROM
      user
   WHERE user_id = ${userId};`;
  const userArray = await db.get(getUserQuery);
  response.send(userArray);
});


app.post("/register/",async(request,response)=>{
    const userDetails = request.body;
    const {name} = userDetails;
    const postUserQuery = 
    `INSERT INTO user(name)
     VALUES (
         '${name}'
         );`;
    const dbResponse = await db.run(postUserQuery);
    const userId = dbResponse.lastID;
    response.send({userId:userId})
     
})

app.put("/register/:userId/",async(request,response)=>{
    const userDetails = request.body;
    const {userId} =request.params ;
    const {name} = userDetails ;
    updatedUserQuery = `
    UPDATE user 
    SET name = "${name}"
    WHERE user_id = ${userId};
    `;
    await db.run(updatedUserQuery);
    response.send("userDetails Updated Successfully...!")
})


