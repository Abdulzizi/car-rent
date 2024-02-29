import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Membaca data header request.
        const header = req.headers.authorization;

        // Membaca data token yang dikirim
        const token = header?.split(" ")[1] || ""; // Mengambil token setelah 'Bearer'
        const secretKey = "ABISHEK";

        // Proses verifikasi token
        verify(token, secretKey, (err) => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized"
                });
            }
            next(); // Jika token valid, lanjutkan ke middleware atau handler berikutnya
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
}

export { verifyAdmin };