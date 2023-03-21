# Getting Starter with Nodejs & Prisma ORM

## <ins> Playing on hard mode </ins>

Node.js comes with everything you need to build a fully functional API. However, it's very tedious and unwise to use the raw modules. For context and appreciation of frameworks, let's do it anyway!

```js

import http from "http";

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "hello" }));

    res.end();
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "nope" }));
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
```
... and just like that, we have an API. It doesn't do much functionally, but it works. A client can issue a GET request to the server at / and get back some JSON. Any other request will yield a different message and a 404 status code. We'll talk about HTTP Methods, status codes, and routes later in the course.

Lets create an API with Express instead of the vanilla JavaScript one we created earlier.

## <ins> Dependencies

Before we can use Express, we need to install it. Using NPM or Yarn:

`npm i express --save` or ``yarn add express``

Next, let's create a simple API!

```js
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const path = require("path");

app.use(express.static("static"));

/**
 * app.[method]([route], [route handler])
 */
app.get("/", (req, res) => {
  // sending back an HTML file that a browser can render on the screen.
  res.sendFile(path.resolve("pages/index.html"));
});

// creates and starts a server for our API on a defined port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```
Express literally gives us a framework to build out the business logic of our APIs without having to put too much thought into how to make the API functional in the first place

## <ins> What is Prisma

Prisma is a DB agnostic, type safe ORM. It supports most DBs out there. It not only has an SDK for doing basic and advanced querying of a DB, but also handles schemas, migrations, seeding, and sophisticated writes. It's slowly but surely becoming the ORM of choice for Node.js projects.

## <ins> Installing Prisma

Prisma works best when you're using a TypeScript. So in addition to installing Prisma, we're going to convert our app to TypeScript. Don't worry if you don't know TypeScript. We won't be doing all the fancy typed stuff in this course. We just want that sweet autocomplete for our DB interactions through Prisma. Trust me, its magical ✨. On to the installing! 

```sh
npm i typescript ts-node @types/node prisma --save-dev
```
Then create a tsconfig.json file which is the config file for TypeScript. Add this to that file: 
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```
Next, we'll initalize Prisma

``npx prisma init``

This command will do a few things:

- Create a prisma folder
- Create a schema file in that folder Next, we'll learn how to design and create some models in our schema

## <ins> Prisma Syntax

Prisma has an easy to understand syntax for creating models. Its based on the GraphQL language which is based on JSON. So you'll feel right at home. I highly recommend installing the Prisma VS Code plugin. It lints and cleans up your schema file.

Now, onto the models. Let's look at an example model.

```js
model Post {
  // id field that is a number and automatically increments after its used
  id        Int      @id @default(autoincrement())
  // timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // limit to 255 for indexing UTF-8
  title     String   @db.VarChar(255)
  // optional
  content   String?
  published Boolean  @default(false)
  // relation to another model
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

```
## <ins> Migrations

Since this is our first time interacting with the DB, we need to run our initial migration to get the DB and our schema in sync. We'll continue to run migrations as we make schema changes to ensure the schema and any data in the DB stay in sync. Before we run a migration, we need to install the prisma client which is the SDK we'll use in our code to interact with the DB. This client is type-safe and based on of our schema. It's actually an NPM package that gets generated on demand to adjust to your schema! Pretty cool.

``npm i @prisma/client --save``

Next, lets migrate the DB. Make sure you added your DB connection string to the ``.env`` file as ``DATABASE_URL``. You can find the connection string on render. Be sure to use the external one. Now to run the migration:

``npx prisma migrate dev --name init``

This will migrate the DB over to use our schema and then generate the new client for us. This client will be used in our code and is now type-checked against our schema.

## <ins> Create our routes

Create a new file, ``src/router.ts`` and work in there.

```js
import { Router } from "express";

const router = Router();
/**
 * Product
 */
router.get("/product", (req, res) => {
  res.json({ message: "product" });
});

router.get("/product/:id", (req, res) => {});

router.post("/product", (req, res) => {});

router.put("/product/:id", (req, res) => {});

router.delete("/product/:id", (req, res) => {});

/**
 * Update
 */

router.get("/update", (req, res) => {});

router.get("/update/:id", (req, res) => {});

router.post("/update", (req, res) => {});

router.put("/update/:id", (req, res) => {});

router.delete("/update/:id", (req, res) => {});

/**
 * UpdatePoint
 */

router.get("/updatepoint", (req, res) => {});

router.get("/updatepoint/:id", (req, res) => {});

router.post("/updatepoint", (req, res) => {});

router.put("/updatepoint/:id", (req, res) => {});

router.delete("/updatepoint/:id", (req, res) => {});

export default router;
```

There are a few things going on here. First we created a new router using Express. This gives us more flexibility around configuring a set of routes vs. the whole API. You can create as many routers as you'd like with Express and mount them back to the main Express app on the appropriate paths. <br>
We then created all the routes for the DB resources we want to interact with. User is noticiably missing. This is because User will have a special set of routes because of the importantance of that resource. For the handlers, we adding placeholder functions for now. If you try to make an API call, your API will get back a 404 status code and some HTML (default `404` response from Express). That's because we didn't mount this router back to the main Express app. So it's just floating and not actually attached to our API. Let's do that next:
head over to ``src/server.ts``:

```js
import router from './router'

.......
app.use('/api', router)
```

Import the router from the other file and remove any current route declerations in ``server.ts``. We then use something new here: ``app.use()``, this allows you to apply a router or middleware (we will learn about middleware later) to the entire API, or in our case, to anything using the path ``/api``. So a route we create in the router like ``GET /product``, is now actually ``GET /api/product`` because the router is mounted on the ``/api`` path.

You should now be able to hit your API and not get a 404, but, it still won't work. What's happening now is your API is hanging, which just means it never responded back to the request and there is no more code to execute. The client will eventually timeout and close the connection. This happens because we never send a response in any of the handler functions we created. We'll do that soon, but for now, lets talk about middleware.

## <ins> Create a middleware

Middleware are functions that run right before your handlers run. They can do things like augment the request, log, handle errors, authenticate, and pretty much anything else. They look exactly like a handler with one difference. Because you can have a list of middleware, there needs to be a mechanism to move into the next middlware function when work is done in the current middleware. It looks like this:

```js
const myMiddlware = (req, res, next) => {
  // ... do my work, and when I done call next()
  next();
};
```
This ``next`` function is exactly what it sounds like. It tells Express that we're done in the middleware and it's safe to proceed to whatever is next (more middleware or a handler).
To apply the middleware to a route, you can do this:
```js
app.get("/todo/:id", myMiddleware, my2ndMiddleware, handler);
// or
app.get("/todo/:id", [myMiddleware, my2ndMiddleware], handler);
```
Middleware will run in the order in which you passed them as arguments. 

## <ins> Nodemon

Throughout the course, Scott is manually stopping and starting the server anytime changes in the source code occurs. This was an intential decision to reduce the complexity of the setup. However, if you want your server to auto-restart when there is a change, you can use nodemon.

## Nodemon Setup Instructions

Install nodemon

```sh
npm install nodemon --save-dev
```

<div style="padding: 15px; border: 1px solid transparent; border-color: transparent; margin-bottom: 20px; border-radius: 4px; color: #8a6d3b;; background-color: #fcf8e3; border-color: #faebcc;">
<strong>&#9888; Warning:<br/></strong> nodemon is a installed as a development dependency because, once the application is deployed, the web host will be responsible for starting the server.
</div>

Once nodemon is installed, update the ``dev`` script in your package.json file

```json
"dev": "nodemon src/index.ts"
```
We don't want just anyone using our API. Our DB is multi-tenat, so we need to identify what user is making the request so we can scope their queries and writes to the user. We don't want one user having access to another user's data.

To ensure all of this, we're going to protect our API. Tokens are a great approach for this. Things like API Keys and JWT's are good examples of tokens. You could also use Sessions. We're going to use JWTs.

## <ins> Creating a JWT

Lets create a function that create's JWTs for when a new user signups up or current one signs in. Users will need to send the JWT on every single request to get access to the API. Our API never stores a JWT, its stored client side.

We need to install a few things:

```sh
npm i jsonwebtoken bcrypt dotenv
```

Create a new file ``src/modules/auth.ts`` and add this:

```js
import jwt from "jsonwebtoken";

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};
```
This function will take a user and create a JWT from the user's id and username. This is helpful for later when we check for a JWT, we then will know what user is making the request. <br />
To do that check, we'll create custom middleware.

```js
export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    console.log("here");
    res.status(401);
    res.send("Not authorized");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    console.log(payload);
    next();
    return;
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Not authorized");
    return;
  }
};
```
This middleware functions checks for a JWT on the ``Authorization`` header of a request. It then attaches the user to the request object before moving on. If anything fails, the user is sent a 401.
We need to update our ``.env`` file to have a ``JWT_SECRET``. You don't want this secret in your code because it's needed to sign and verify tokens. You can place whatever value you want. Then we need to load in the env file into our environment.
Inside of ``src/index.ts``:

```js
import * as dotenv from "dotenv";
dotenv.config();
```
This will load in our env vars into the process.

Lastly, we need to add our middleware onto our API router to protect it, so inside of `src/server.ts`, import protect and add it to the chain: 

```js
app.use("/api", protect, router);
```
Now any API call to anthing ``/api`` will need to have a JWT. <br />
Next we'll create some routes and handlers to create users that are issued JWTs.