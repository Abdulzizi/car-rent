import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { sign } from "jsonwebtoken";
// import { env } from "process";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { nama, email, password } = req.body;

        if (!nama || !email || !password) {
            return res.status(500).json({
                status: false,
                message: "Fill the blank field."
            });
        } else {
            const result = await prisma.admin.create({
                data: {
                    nama_admin: nama,
                    email: email,
                    password: md5(password)
                }
            });

            return res.status(200).json({
                status: true,
                message: `User berhasil dibuat.`,
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err
        });
    }
}

export const showAdmin = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Default page size to 10 if not provided
        const skip = (page - 1) * pageSize;
        const keyword = req.query.keyword?.toString() || "";

        const result = await prisma.admin.findMany({
            skip,
            take: pageSize,
            where: {
                OR: [
                    {
                        email: {
                            contains: keyword
                        }
                    }
                ]
            },
            orderBy: {
                nama_admin: "asc"
            }
        });

        if (result.length == 0) {
            return res.status(500).json({
                status: false,
                message: "No admin found for the given page"
            });
        } else {
            return res.status(200).json({
                status: true,
                result,
                pageInfo: {
                    currentPage: page,
                    pageSize
                }
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err || "Internal Server Error"
        });
    }
}

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { nama, email, password } = req.body;
        const adminID = Number(req.params.adminID);

        const findAdmin = await prisma.admin.findFirst({
            where: {
                id: adminID
            }
        });

        if (!findAdmin) {
            return res.status(400).json({
                status: false,
                message: `Admin dengan ID ${adminID} tidak ditemukan`
            });
        } else {
            const result = await prisma.admin.update({
                where: {
                    id: adminID
                },
                data: {
                    nama_admin: nama || findAdmin.nama_admin,
                    email: email || findAdmin.email,
                    password: password || findAdmin.password
                }
            });

            return res.status(200).json({
                status: true,
                message: "Data berhasil diubah",
                result
            });
        }

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err
        });
    }
}

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const adminID = req.params.adminID;

        const findAdmin = await prisma.admin.findFirst({
            where: {
                id: Number(adminID)
            }
        });

        if (!findAdmin) {
            return res.status(400).json({
                status: false,
                message: `Data dengan ID ${adminID} tidak ditemukan.`
            });
        } else {
            await prisma.admin.delete({
                where: {
                    id: Number(adminID)
                }
            });

            return res.status(200).json({
                status: true,
                message: `Item dengan ID ${adminID} berhasil dihapus`
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            err
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const email = req.body.username;
        const password = md5(req.body.password);

        const admin = await prisma.admin.findFirst({
            where: {
                email: email,
                password: password
            }
        });

        if (admin) {
            const payload = admin;
            const secretKey = process.env.SECRET_KEY;

            if (!secretKey) {
                throw new Error('Secret key is not defined in environment variables.');
            }

            const token = sign(payload, secretKey);

            return res.status(200).json({
                status: true,
                message: "Admin found",
                admin,
                token
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Admin not found."
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            err
        });
    }
}

/**
 * Abdul
 * Password : Testingpassword
 * 
 * Abi
 * Password : 12345
 * 
 * Danniar
 * Password : Blow
 * 
 * Adit
 * Password : Negawatt
 */