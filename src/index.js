const app = require("./app");
require("dotenv").config();
const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log("listening on port " + port);
});
