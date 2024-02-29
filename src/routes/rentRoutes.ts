import express from 'express';
import * as rent from "../controller/rentController";

const app = express();

app.use(express.json());

app.get("/rent", rent.showRent);
app.patch("/rent/:rentID", rent.updateRent);
app.delete("/rent/:rentID", rent.deleteRent);
app.post("/rent", rent.createRent);

export default app;