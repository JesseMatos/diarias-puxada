const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Criar viagem (motorista inicia)
router.post("/", async (req, res) => {
  try {
    const { departAt } = req.body;
    const driverId = req.user.userId;

    const trip = await prisma.trip.create({
      data: {
        driverId,
        departAt: new Date(departAt),
      },
    });

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar viagem" });
  }
});

// Finalizar viagem (motorista chega)
router.put("/:id/finish", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { arriveAt, value } = req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        arriveAt: new Date(arriveAt),
        value,
        status: "finished",
      },
    });

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Erro ao finalizar viagem" });
  }
});

module.exports = router;
