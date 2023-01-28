const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const prisma = require("../../services/prismaService")

//GET ALL USERS
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error)
  }
});

//GET USER
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
});

//UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const { username, email, password } = req.body

    const updateUser = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        username: username,
        email: email,
        password: password,
      },
    })
    res.json(updateUser)
  } catch (error) {
    next(error);
  }
});

//DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    })
    res.json(deleteUser)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
