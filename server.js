const { app } = require("./app/config/app");

const port = process.env.PORT || 3000;
require("dotenv").config();

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
