const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, cpf } = req.body;

    if (!name || !cpf || cpf.length < 4) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const rawPassword = cpf.substring(0, 4);
    const hashed = await bcrypt.hash(rawPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        cpf,
        password: hashed,
        role: "driver",
        wallet: { create: { balance: 0, threshold: 0 } }
      }
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      senha_criada: rawPassword
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Erro ao registrar" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(400).json({ error: "CPF e senha são obrigatórios" });
    }

    const user = await prisma.user.findUnique({ where: { cpf } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, cpf: user.cpf, role: user.role }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;
