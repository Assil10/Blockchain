const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/investments", require("./routes/investment.routes"));
app.use("/api/rent", require("./routes/rent.routes"));
app.use("/api/users", require("./routes/user.routes"));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
