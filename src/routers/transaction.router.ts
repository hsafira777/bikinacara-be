import { Router } from "express";
import { upload, uploadToCloudinary } from "../services/upload.service";
import { createTransactionController, getTransactionByIdController, } from "../controllers/transaction.controller";
import { verifyToken, attendeeGuard } from "../middlewares/auth.middleware";

const router = Router();

// Create Transaction
router.post("/", verifyToken, attendeeGuard, createTransactionController);

// Upload bukti pembayaran ke Cloudinary
router.patch("/:id/payment-proof",verifyToken, attendeeGuard, upload.single("paymentProof"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    try {
      const result: any = await uploadToCloudinary(
        req.file.buffer,
        "payment_proof", // Folder di Cloudinary
        `${req.params.id}_${Date.now()}`
      );

      res.json({
        message: "Bukti pembayaran berhasil diupload",
        url: result.secure_url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal upload bukti pembayaran" });
    }
  }
);

// Get Transaction by ID
router.get("/:id", verifyToken, attendeeGuard, getTransactionByIdController);

export default router;
