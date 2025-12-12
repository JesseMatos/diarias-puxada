const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { calcularDiaria } = require("../calculoDiaria");

// Função auxiliar para calcular tempos
function calcularTempos(trip) {
  const tempos = {
    totalTripHours: null,
    travelToFactoryHours: null,
    waitBeforeLoadHours: null,
    loadingHours: null,
    postLoadHours: null,
    returnHours: null
  };

  if (trip.departDepotAt && trip.arriveDepotAt) {
    tempos.totalTripHours = (trip.arriveDepotAt - trip.departDepotAt) / 3600000;
  }

  if (trip.departDepotAt && trip.arriveFactoryAt) {
    tempos.travelToFactoryHours = (trip.arriveFactoryAt - trip.departDepotAt) / 3600000;
  }

  if (trip.arriveFactoryAt && trip.loadStartAt) {
    tempos.waitBeforeLoadHours = (trip.loadStartAt - trip.arriveFactoryAt) / 3600000;
  }

  if (trip.loadStartAt && trip.loadEndAt) {
    tempos.loadingHours = (trip.loadEndAt - trip.loadStartAt) / 3600000;
  }

  if (trip.loadEndAt && trip.leaveFactoryAt) {
    tempos.postLoadHours = (trip.leaveFactoryAt - trip.loadEndAt) / 3600000;
  }

  if (trip.leaveFactoryAt && trip.arriveDepotAt) {
    tempos.returnHours = (trip.arriveDepotAt - trip.leaveFactoryAt) / 3600000;
  }

  return tempos;
}

/* -------------------- ROTAS -------------------- */

// 1) Criar viagem
router.post("/create", async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const driverId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: driverId }
    });

    if (!user) {
      return res.status(404).json({ error: "Motorista não encontrado" });
    }

    const trip = await prisma.trip.create({
      data: {
        driverId,
        driverName: user.name,
        driverCPF: user.cpf,
        driverPhone: null,
        status: "pending"
      }
    });

    res.json({ success: true, trip });

  } catch (err) {
    console.error("ERRO AO CRIAR VIAGEM:", err);
    res.status(500).json({ error: "Erro ao criar viagem", detail: err.message });
  }
});

// 2) Saída do galpão
router.post("/start", async (req, res) => {
  try {
    const { tripId, latitude, longitude } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        departDepotAt: new Date(),
        startLat: latitude ?? null,
        startLng: longitude ?? null,
        status: "ongoing"
      }
    });

    res.json({ success: true, trip });

  } catch (err) {
    console.error("ERRO AO REGISTRAR SAÍDA DO GALPÃO:", err);
    res.status(500).json({ error: "Erro ao registrar saída do galpão" });
  }
});

// 3) Chegada na fábrica
router.post("/arrive-factory", async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: { arriveFactoryAt: new Date() }
    });

    res.json({ success: true, trip });

  } catch (err) {
    console.error("ERRO AO REGISTRAR CHEGADA NA FÁBRICA:", err);
    res.status(500).json({ error: "Erro ao registrar chegada na fábrica" });
  }
});

// 4) Início do carregamento
router.post("/load-start", async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: { loadStartAt: new Date() }
    });

    res.json({ success: true, trip });

  } catch (err) {
    console.error("ERRO AO INICIAR CARREGAMENTO:", err);
    res.status(500).json({ error: "Erro ao iniciar carregamento" });
  }
});

// 5) Fim do carregamento
router.post("/load-end", async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: { loadEndAt: new Date() }
    });

    res.json({ success: true, trip });

  } catch (err) {
    console.error("ERRO AO FINALIZAR CARREGAMENTO:", err);
    res.status(500).json({ error: "Erro ao finalizar carregamento" });
  }
});

// 6) Saída da fábrica
router.post("/leave-factory", async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: { leaveFactoryAt: new Date() }
    });

    res.json({ success: true, trip });

  } catch (err) {
    console.error("ERRO AO REGISTRAR SAÍDA DA FÁBRICA:", err);
    res.status(500).json({ error: "Erro ao registrar saída da fábrica" });
  }
});

// 7) Finalizar viagem
router.post("/finish", async (req, res) => {
  try {
    const { tripId, latitude, longitude } = req.body;

    const tripFinal = await prisma.trip.update({
      where: { id: tripId },
      data: {
        arriveDepotAt: new Date(),
        endLat: latitude ?? null,
        endLng: longitude ?? null,
        status: "finished"
      }
    });

    const tempos = calcularTempos(tripFinal);

    const diaria = calcularDiaria(
      tripFinal.departDepotAt.toISOString(),
      tripFinal.arriveDepotAt.toISOString()
    );

    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...tempos,
        diarias: diaria.diarias,
        refeicoes: diaria.refeicoes,
        valorFinal: diaria.valorFinal
      }
    });

    res.json({ success: true, trip: updated });

  } catch (err) {
    console.error("ERRO AO FINALIZAR VIAGEM:", err);
    res.status(500).json({ error: "Erro ao finalizar viagem", detail: err.message });
  }
});

module.exports = router;
