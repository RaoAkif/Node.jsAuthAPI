const router = require("express").Router();
const bcrypt = require("bcrypt");
const prisma = require("../services/prismaService")

//REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
      select: {
        username: true,
        email: true
      }
    })
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

//LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    })
    const validPassword = await bcrypt.compare(req.body.password, user.password)

    validPassword? res.json(user) : res.json("Wrong Credentials")
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
