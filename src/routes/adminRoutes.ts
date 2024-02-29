import express from 'express';
import * as admin from "../controller/adminController";
import { verifyAdmin } from "../middleware/veryfyAdmin";

const app = express();

app.use(express.json());

app.get("/admin", verifyAdmin, admin.showAdmin);
app.patch("/admin/:adminID", verifyAdmin, admin.updateAdmin);
app.delete("/admin/:adminID", verifyAdmin, admin.deleteAdmin);
app.post("/admin/login", admin.login);
app.post("/admin", verifyAdmin, admin.createAdmin);

export default app;