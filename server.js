import { generateUploadURL } from "./s3.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { promises as fs } from "fs";

const app = express();
const PORT = 3000;
const dataURL = "./assets/data/recipes.json";

app.use(bodyParser.json());
app.use(cors());

/** GET requests */
// Read data from the JSON file
app.get("/api/readData", async (req, res) => {
  try {
    const data = await fs.readFile(dataURL, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Retrieve Secure URL from S3 server
app.get("/api/s3URL", async (req, res) => {
  const imageType = req.query.imageType;
  console.log("Image Type: ", imageType);
  const url = await generateUploadURL(imageType);
  console.log(url);
  res.send(url);
});

/** /GET requests*/

/** POST requests */
// Write data to the JSON file
app.post("/api/writeData", async (req, res) => {
  console.log(req.body);
  try {
    // Read existing data from the file
    const existingData = await fs.readFile(dataURL, "utf-8");
    const parsedData = JSON.parse(existingData);

    parsedData.recipes.push(...req.body.recipes);

    await fs.writeFile(dataURL, JSON.stringify(parsedData, null, 2));
    res.json({ message: "Data written successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/** /POST requests */

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
