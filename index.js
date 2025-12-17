const express = require("express");
const inventoryRoutes = require("./routes/inventory.route");
const storeRoutes = require("./routes/store.route");
const errorHandler = require("./middleware/error-handler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/inventory", inventoryRoutes);
app.use("/api/store", storeRoutes);

app.use(errorHandler); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
