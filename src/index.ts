import fastify from "fastify";
import cors from "@fastify/cors";
import { rotasRecomendacao } from "./http/rotas.js";
import dotenv from "dotenv";

dotenv.config();

const app = fastify({ logger: true });

app.register(cors);
app.register(rotasRecomendacao());

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || "0.0.0.0";
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
