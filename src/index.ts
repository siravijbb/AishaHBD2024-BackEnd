import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'


const app =
    new Elysia()
        .use(cors({
            origin: /.*\.polygang\.fan$/ || "http://localhost:5173",
        }))
        .use(swagger())
        .get("/", () => "Hello Elysia").listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
