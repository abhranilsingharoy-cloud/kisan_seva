import { Router } from "express"; export const recommendRouter = Router(); recommendRouter.get("/", (_, res) => res.json({ recommendations: [] }));
