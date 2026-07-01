import { describe, expect, it } from "vitest";
import { request } from "../setup.js";

describe("Test column routes", () => {
    async function setupBoard() {
        const user = { name: "Test User", email: "test@test.com", password: "password123" };
        const reg = await request.post("/api/v1/auth/register").send(user);
        const token = reg.body.data.accessToken;

        const orgRes = await request
            .post("/api/v1/organizations")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Org", description: "o" });

        const projRes = await request
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Proj", description: "p", organizationId: orgRes.body.data._id });

        const boardRes = await request
            .post(`/api/v1/projects/${projRes.body.data._id}/boards`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Board 1", description: "b" });

        return { token, board: boardRes.body.data };
    }

    it("creates, lists, updates and deletes columns", async () => {
        const { token, board } = await setupBoard();

        // create columns
        const names = ["To Do", "In Progress", "Done"];

        for (const n of names) {
            const r = await request
                .post(`/api/v1/boards/${board._id}/columns`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: n });

            expect(r.status).toBe(201);
        }

        // list
        const list = await request
            .get(`/api/v1/boards/${board._id}/columns`)
            .set("Authorization", `Bearer ${token}`);

        expect(list.status).toBe(200);
        expect(Array.isArray(list.body.data)).toBe(true);
        expect(list.body.data.length).toBe(3);

        const column = list.body.data[0];

        // get
        const getRes = await request
            .get(`/api/v1/columns/${column._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(getRes.status).toBe(200);

        // update
        const upd = await request
            .patch(`/api/v1/columns/${column._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated" });

        expect(upd.status).toBe(200);
        expect(upd.body.data.name).toBe("Updated");

        // delete
        const del = await request
            .delete(`/api/v1/columns/${column._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(del.status).toBe(200);

        const after = await request
            .get(`/api/v1/columns/${column._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(after.status).toBe(404);
    });
});