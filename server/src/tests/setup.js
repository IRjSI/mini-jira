import { beforeAll, afterEach, afterAll } from "vitest";
import supertest from "supertest";
import app from "../app.js";
import * as db from "./db.js";

let server;
let request;

beforeAll(async () => {
    await db.connect();
    server = app.listen(0);
    request = supertest(app);
});

afterEach(async () => {
    await db.clearDatabase();
});

afterAll(async () => {
    await db.closeDatabase();
    server?.close();
});

export { request };