const app = require("./app");
const { connectToDatabase } = require("./config/database");

connectToDatabase()

app.listen(process.env.PORT, () => {
   console.log(`Server is working on port ${process.env.PORT}`);
})