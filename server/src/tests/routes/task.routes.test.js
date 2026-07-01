import { describe, expect, it } from "vitest";
import { request } from "../setup.js";

describe("Test task routes", () => {
    async function setupColumnWithTwoColumns() {
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
            .send({ name: "Board", description: "b" });

        const colA = await request
            .post(`/api/v1/boards/${boardRes.body.data._id}/columns`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Col A" });

        const colB = await request
            .post(`/api/v1/boards/${boardRes.body.data._id}/columns`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Col B" });

        return { token, colA: colA.body.data, colB: colB.body.data };
    }

    it("creates, fetches, updates, moves and deletes tasks", async () => {
        const { token, colA, colB } = await setupColumnWithTwoColumns();

        // create task in colA
        const createRes = await request
            .post(`/api/v1/tasks/columns/${colA._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Task 1", description: "t", priority: "medium" });

        expect(createRes.status).toBe(201);
        const task = createRes.body.data;

        // get by id
        const getRes = await request
            .get(`/api/v1/tasks/${task._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body.data._id).toBe(task._id);

        // list by column
        const listRes = await request
            .get(`/api/v1/tasks/columns/${colA._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(listRes.status).toBe(200);
        expect(Array.isArray(listRes.body.data)).toBe(true);

        // update
        const upd = await request
            .patch(`/api/v1/tasks/${task._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Task", priority: "low" });

        expect(upd.status).toBe(200);
        expect(upd.body.data.title).toBe("Updated Task");

        // move to colB
        const mv = await request
            .patch(`/api/v1/tasks/${task._id}/move`)
            .set("Authorization", `Bearer ${token}`)
            .send({ columnId: colB._id });

        expect(mv.status).toBe(200);

        // confirm task now in colB
        const inB = await request
            .get(`/api/v1/tasks/columns/${colB._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(inB.status).toBe(200);
        expect(inB.body.data.some((t) => t._id === task._id)).toBe(true);

        // delete
        const del = await request
            .delete(`/api/v1/tasks/${task._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(del.status).toBe(200);

        const after = await request
            .get(`/api/v1/tasks/${task._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(after.status).toBe(404);
    });
});