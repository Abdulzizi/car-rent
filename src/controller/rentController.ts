import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRent = async (req: Request, res: Response) => {
    try {
        const { carID, nama_penyewa, lama_sewa } = req.body;

        if (!carID || !nama_penyewa || !lama_sewa) {
            return res.status(500).json({
                status: false,
                message: "Fill the blank field."
            });
        }

        const car = await prisma.car.findUnique({
            where: {
                id: carID
            }
        });

        if (!car) {
            return res.status(404).json({
                status: false,
                message: "Car not found.",
            });
        }

        // Calculate total_harga
        const total_harga = Number(car.harga_perhari) * lama_sewa;

        // Create rent entry
        const result = await prisma.rent.create({
            data: {
                car_id: carID,
                nama_penyewa,
                lama_sewa,
                total_bayar: total_harga
            }
        });

        return res.status(201).json({
            status: true,
            message: "Rental data created successfully.",
            result,
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err || "Internal Server Error"
        });
    }
}

export const showRent = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Default page size to 10 if not provided
        const skip = (page - 1) * pageSize;
        const keyword = req.query.keyword?.toString() || "";

        const result = await prisma.rent.findMany({
            skip,
            take: pageSize,
            where: {
                OR: [
                    {
                        nama_penyewa: {
                            contains: keyword
                        }
                    }
                ]
            },
            include: {
                car_details: true
            },
            orderBy: {
                car_id: "asc"
            }
        });

        if (result.length == 0) {
            return res.status(500).json({
                status: false,
                message: "No rent data found for the given page"
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

export const updateRent = async (req: Request, res: Response) => {
    try {
        const { carID, nama_penyewa, lama_sewa } = req.body;
        const rentID = Number(req.params.rentID);

        const findRent = await prisma.rent.findFirst({
            where: {
                id: rentID
            }
        });

        if (!findRent) {
            return res.status(400).json({
                status: false,
                message: `Data sewa dengan ID ${rentID} tidak ditemukan`
            });
        } else {
            const car = await prisma.car.findUnique({
                where: {
                    id: carID                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                }
            });
    
            if (!car) {
                return res.status(404).json({
                    status: false,
                    message: "Car not found.",
                });
            }

            const total_bayar = Number(car.harga_perhari) * Number(lama_sewa)

            const result = await prisma.rent.update({
                where: {
                    id: rentID
                },
                data: {
                    car_id: carID || findRent.car_id,
                    nama_penyewa: nama_penyewa || findRent.nama_penyewa,
                    lama_sewa: lama_sewa || findRent.lama_sewa,
                    total_bayar: total_bayar || findRent.total_bayar
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

export const deleteRent = async (req: Request, res: Response) => {
    try {
        const rentID = req.params.rentID;

        const findRent = await prisma.rent.findFirst({
            where: {
                id: Number(rentID)
            }
        });

        if (!findRent) {
            return res.status(400).json({
                status: false,
                message: `Data sewa dengan ID ${rentID} tidak ditemukan.`
            });
        } else {
            await prisma.admin.delete({
                where: {
                    id: Number(rentID)
                }
            });

            return res.status(200).json({
                status: true,
                message: `Data sewa dengan ID ${rentID} berhasil dihapus`
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err || "Internal Server Error"
        });
    }
}