## Steps by Step Guide to reproduce MERN API

1. Just make a server running

```
npm init -y
```

```
npm i express nodemon dotenv
```

In an index.js file put this code:

```
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const colors = require('colors');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT} | http://localhost:${PORT}/`.green.bold.underline)
})
```

Create an .env file and put `PORT= 3000` there

Note: If to connect MongoDB, install these packages too

```
npm i mongoose
```

2. Add User Model with Register & Login

   Add necessary packages:

```
npm i express nodemon dotenv body-parser node-fetch cors colors morgan bcrypt jsonwebtoken express-jwt express-validator google-auth-library
```

To read the documentations of above packages:

- [colors](https://www.npmjs.com/package/colors)
- [morgan](https://www.npmjs.com/package/morgan)

#### Prisma Integration

```
npm install prisma --save-dev
```

```
npx prisma init
```

Update `schema.prisma` with:

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  post      Post[]
}

model Post {
  id          Int    @id @default(autoincrement())
  title       String
  description String
  user        User   @relation(fields: [userId], references: [id])
  userId      Int

  @@index([userId])
}

```

##### Add PlanetScale DATABASE_URL

```
DATABASE_URL='mysql://<unique_username_id>:<password>@us-east.connect.psdb.cloud/creative-hat-api?sslaccept=strict'
```

##### Push Schema to PlanetScale

```
prisma db push
```

#### Setup Prisma Client

```
npm install @prisma/client
```

#### Whenever Add or Update Prisma Schema, Run

```
prisma generate
```

#### Open Prisma Studio

```
npx prisma studio
```

Now add User and Post data using Prisma Studio at http://localhost:5555

#### Querying the database

##### Query All Users & All Posts

In `routes/users.js`

```
const router = require("express").Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

//GET ALL USERS
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
```

In `routes/posts.js`

```
const router = require("express").Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

//GET ALL POSTS
router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
```

##### Update Index.js file

```
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

app.use(express.json());

const PORT = process.env.PORT || 5000;

// ROUTES PRISMA
app.use("/api/users", userRoute);
app.use("/api/posts", postsRoute);

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT} | http://localhost:${PORT}/`)
})
```

##### Testing API

```
http://localhost:3000/api/users
```

```
http://localhost:3000/api/posts
```

### IF EVEYTHING IS WORKING FINE, THEN

Add Authentication, Users and Posts Controllers and Routes.

Create `routes/auth.js`

```
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
```

Update `routes/users.js`

```
const router = require("express").Router();
const bcrypt = require("bcrypt");
const prisma = require("../services/prismaService")

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
```

Update `routes/posts.js`

```
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
```

Import Routes in `index.js ` file

```
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

dotenv.config();

app.use(express.json());

  // ROUTES PRISMA
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/posts", postsRoute);

  // LISTEN TO PORT
  app.listen("5000", () => {
    console.log("Backend is running.");
  });

```

#### CORS Configurations

Add a `config/allowedOrigins.js` and `config/corsOptions.js` with the following code

`config/allowedOrigins.js`

```
const allowedOrigins = [
  'http://localhost:5000',
  'https://www.mernauth.com',
  'https://mernauth.com'
]

module.exports = allowedOrigins
```

`config/corsOptions.js`

```
const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions
```

Update `index.js` file

```
...
...
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
...
...
app.use(cors(corsOptions))
...
...
```

#### Data Seeding Process

Update package.json file

`package.json`

```
...
...
"prisma": {
    "seed": "node prisma/seed.js"
  },
...
...
```

Add `prisma/seed.js` file

`prisma/seed.js`

```
const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('123456', salt)
  const akif = await prisma.user.upsert({
  
    where: { email: 'akifrao@gmail.com' },
    update: {},
    create: {
      email: 'akifrao@gmail.com',
      password: hashedPassword,
      username: 'raoakif',
      post: {
        create: [
          {
            title: 'First Post',
            description: 'This is the description of my first post'
          },
          {
            title: 'Second Post',
            description: 'This is the description of my second post'
          },
        ],
      },
    },
  })

  const umman = await prisma.user.upsert({
    where: { email: 'ummanwaseem@gmail.com' },
    update: {},
    create: {
      email: 'ummanwaseem@gmail.com',
      password: hashedPassword,
      username: 'ummanwaseem',
      post: {
        create: [
          {
            title: 'Third Post',
            description: 'This is the description of my third post'
          },
          {
            title: 'Forth Post',
            description: 'This is the description of my forth post'
          },
        ],
      },
    },
  })
  console.log({ akif, umman })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

1. We empty the Database by droping the database tables.
2. Push the schema and create tables in database. In case of PlanetScale `npx prisma db push`
3. Seed the database with the command `npx prisma db seed`


#### Separating Controllers and Router Logic

Create `controllers/authController.js`, `controllers/userController.js`, `controllers/postController.js`

`controllers/authController.js`

```
const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc Register a new user
// @route POST /users
// @access Private
const registerUser = async (req, res, next) => {
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
}

// @desc Login a new user
// @route POST /users
// @access Private
const loginUser = async (req, res, next) => {
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
}

module.exports = {
  registerUser,
  loginUser
}
```

`controllers/userController.js`

```
const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc Create a new user
// @route POST /users
// @access Private
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error)
  }
}

// @desc Create a new user
// @route POST /users
// @access Private
const getUserById = async (req, res, next) => {
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
}

// @desc Update a user
// @route POST /users/1
// @access Private
const updateUser = async (req, res, next) => {
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
}

// @desc Delete a user
// @route POST /users/1
// @access Private
const deleteUser = async (req, res, next) => {
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
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}
```

`controllers/postController.js`

```
const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc Create a New Post
// @route POST /posts
// @access Private
const createPost = async (req, res, next) => {
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
}

// @desc Get All Posts
// @route POST /posts
// @access Private
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    next(error)
  }
}

// @desc Get a Post
// @route POST /posts/1
// @access Private
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    })
    res.json(post)
  } catch (error) {
    next(error)
  }
}

// @desc Update a post
// @route POST /posts/1
// @access Private
const updatePost = async (req, res, next) => {
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
}

// @desc Delete a post
// @route POST /posts/1
// @access Private
const deletePost = async (req, res, next) => {
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
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
}
```


Update `routes/auth`, `routes/users `, `routes/posts`

`routes/auth`

```
const router = require("express").Router();
const authController = require("../controllers/authController")

// Register
router.route("/register")
  .post(authController.registerUser)

// Login
router.route("/login")
  .post(authController.loginUser)

module.exports = router;
```

`routes/users`

```
const router = require("express").Router();
const userController = require("../controllers/userController")

// Register
router.route("/")
  .get(userController.getAllUsers)

// Login
router.route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router;
```

`routes/posts`

```
const router = require("express").Router();
const postController = require("../controllers/postController")

// Register
router.route("/")
  .post(postController.createPost)
  .get(postController.getAllPosts)

// Login
router.route("/:id")
  .get(postController.getPostById)
  .put(postController.updatePost)
  .delete(postController.deletePost)

module.exports = router;
```
