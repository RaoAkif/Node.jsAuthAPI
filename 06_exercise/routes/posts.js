const router = require("express").Router();
const prisma = require("../services/prismaService")

//CREATE POST
router.post("/", async (req, res, next) => {
  const { title, description, userId } = req.body
  try {
    const newPost = await prisma.post.create({
      data: {
        title: title,
        description: description,
        userId: Number(userId)
      }
    })
    res.json(newPost);
  } catch (error) {
    next(error);
  }
});

//UPDATE POST
router.put("/:id", async (req, res, next) => {
  try {
    const { title, description, userId } = req.body
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        title: title,
        description: description,
        userId: Number(userId)
      }
    })
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

//DELETE POST
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.json(deletedPost)
  } catch (error) {
    next(error);
  }
});

//GET POST
router.get("/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.id)
      }
    })
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

//GET ALL POSTS
router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany()
    res.json(posts)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
