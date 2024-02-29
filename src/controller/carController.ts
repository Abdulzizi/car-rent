import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCar = async (req: Request, res: Response) => {
    try {
        const { nopol, merk, harga_perhari } = req.body;

        if (!nopol || !merk || !harga_perhari) {
            return res.status(500).json({
                status: false,
                message: "Fill the blank field."
            });
        } else {
            const result = await prisma.car.create({
                data: {
                    nopol,
                    merk_mobil: merk,
                    harga_perhari
                }
            });

            return res.status(200).json({
                status: true,
                message: `Data mobil berhasil dibuat.`,
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err || "Internal Server Error"
        });
    }
}

export const showCar = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Default page size to 10 if not provided
        const skip = (page - 1) * pageSize;
        const keyword = req.query.keyword?.toString() || "";

        const result = await prisma.car.findMany({
            skip,
            take: pageSize,
            where: {
                OR: [
                    {
                        nopol: {
                            contains: keyword
                        },
                        merk_mobil: {
                            contains: keyword
                        },
                    }
                ]
            },
            include: {
                Rent: true
            },
            orderBy: {
                id: "asc"
            }
        });

        if (result.length == 0) {
            return res.status(500).json({
                status: false,
                message: "No car data found for the given page"
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

export const updateCar = async (req: Request, res: Response) => {
    try {
        const { nopol, merk, harga_perhari } = req.body;
        const carID = Number(req.params.carID);

        const findCar = await prisma.car.findFirst({
            where: {
                id: carID
            }
        });

        if (!findCar) {
            return res.status(400).json({
                status: false,
                message: `Data mobil dengan ID ${carID} tidak ditemukan`
            });
        } else {
            const result = await prisma.car.update({
                where: {
                    id: carID
                },
                data: {
                    nopol: nopol || findCar.nopol,
                    merk_mobil: merk || findCar.merk_mobil,
                    harga_perhari: harga_perhari || findCar.harga_perhari
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
            message: err || "Internal Server Error"
        });
    }
}

export const deleteCar = async (req: Request, res: Response) => {
    try {
        const carID = req.params.carID;

        const findCar = await prisma.car.findFirst({
            where: {
                id: Number(carID)
            }
        });

        if (!findCar) {
            return res.status(400).json({
                status: false,
                message: `Data mobil dengan ID ${carID} tidak ditemukan.`
            });
        } else {
            await prisma.admin.delete({
                where: {
                    id: Number(carID)
                }
            });

            return res.status(200).json({
                status: true,
                message: `Data mobil dengan ID ${carID} berhasil dihapus`
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            err
        });
    }
}