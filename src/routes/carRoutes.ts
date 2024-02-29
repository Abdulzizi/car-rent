import express from 'express';
import * as car from "../controller/carController";

const app = express();

app.use(express.json());

app.get("/car", car.showCar);
app.patch("/car/:carID", car.updateCar);
app.delete("/car/:carID", car.deleteCar);
app.post("/car", car.createCar);

export default app;