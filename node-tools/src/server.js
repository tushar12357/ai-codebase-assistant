import express from "express";
import toolRoutes from "./routes/toolRoutes.js";

const app = express();

app.use(express.json());

app.use("/", toolRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Tool runtime running on port ${PORT}`);
});