import express, {Request, Response} from "express";
import adminRoutes from "./routes/adminRoutes";
import carRoutes from "./routes/carRoutes";
import rentRoutes from "./routes/rentRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(adminRoutes);
app.use(carRoutes);
app.use(rentRoutes);

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Berhasil!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});