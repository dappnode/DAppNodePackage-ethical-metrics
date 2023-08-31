import express from "express";
import path from "path";
import cors from "cors";
import http from "node:http";
import { makeHttpRequestViaTor } from "./makeHttpRequestViaTor.js";
import { PeerPkgs, pkgsHealthUrlMap } from "../../params.js";
import logger from "../logger/index.js";
import axios from "axios";
import url from "url";

export function startApi({
  torInstance,
  registerUrl,
  port = 3000,
}: {
  torInstance: string;
  registerUrl: string;
  port?: number;
}): http.Server {
  const app = express();
  const server = new http.Server(app);
  app.use(express.json());
  app.use(cors());

  app.get("/package-healthcheck", async (req, res) => {
    const pkg = req.query.package;

    logger.debug(`Healthcheck requested for package ${pkg}`);

    // If pkgStr is not PeerPkgs, return 400
    if (!Object.values(PeerPkgs).includes(pkg as PeerPkgs)) {
      res.status(400).json({ message: "Invalid package name" }).send();
      return;
    }

    // Get the healthcheck status of the package
    try {
      const healthCheckUrl = pkgsHealthUrlMap[pkg as PeerPkgs];
      const response = await axios.get(healthCheckUrl);
      res.status(response.status).json({ message: "OK" }).send();
    } catch (e) {
      logger.error(`Error checking health for package ${pkg}`, e as Error);
      res.status(500).send();
    }
  });

  app.get("/instance", async (_req, res) => {
    try {
      res.json({ instance: torInstance }).status(200).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: (error as Error).message })
        .send();
    }
  });

  app.post("/targetByInstance", async (_req, res) => {
    try {
      logger.info(`Getting target by instance ${torInstance} from server`);

      const postBody = {
        Instance: torInstance,
      };

      const message = await makeHttpRequestViaTor(
        "POST",
        url.resolve(registerUrl, "targetByInstance"),
        postBody
      );

      res.json({ message }).status(200).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: (error as Error).message })
        .send();
    }
  });

  // Endpoint to handle registration
  app.post("/targets", async (req, res) => {
    try {
      const email = req.body.email;
      logger.info(
        `Registering instance ${torInstance} with email ${email} in server`
      );

      const postBody = {
        Instance: torInstance,
        Email: email,
      };
      const message = await makeHttpRequestViaTor(
        "POST",
        url.resolve(registerUrl, "targets"),
        postBody
      );

      res.json({ message }).status(200).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: (error as Error).message })
        .send();
    }
  });

  // Endpoint to handle unregistration
  app.delete("/targets", async (req, res) => {
    try {
      logger.info(`Unregistering instance ${torInstance} from server`);
      const deleteBody = [
        {
          instance: torInstance,
        },
      ];
      const message = await makeHttpRequestViaTor(
        "DELETE",
        url.resolve(registerUrl, "targets"),
        deleteBody
      ); // Use helper method

      res.json({ message }).status(200).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: (error as Error).message })
        .send();
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return server;
}
