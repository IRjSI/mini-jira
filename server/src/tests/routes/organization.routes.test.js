import { describe, expect, it } from "vitest";
import { request } from "../setup.js";

describe("Test organization routes", () => {
    async function registerUser() {
        const user = { name: "Test User", email: "test@test.com", password: "password123" };
        const res = await request.post("/api/v1/auth/register").send(user);
        return { accessToken: res.body.data.accessToken, user: res.body.data.user };
    }

    it("creates, reads, updates, bootstraps and deletes an organization", async () => {
        const { accessToken } = await registerUser();

        // create
        const createRes = await request
            .post("/api/v1/organizations")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "Org 1", description: "desc" });

        expect(createRes.status).toBe(201);
        expect(createRes.body.success).toBe(true);
        const org = createRes.body.data;

        // list
        const listRes = await request
            .get("/api/v1/organizations")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(listRes.status).toBe(200);
        expect(listRes.body.success).toBe(true);
        expect(Array.isArray(listRes.body.data)).toBe(true);

        // get
        const getRes = await request
            .get(`/api/v1/organizations/${org._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body.data._id).toBe(org._id);

        // update
        const updRes = await request
            .patch(`/api/v1/organizations/${org._id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "Org Renamed" });

        expect(updRes.status).toBe(200);
        expect(updRes.body.data.name).toBe("Org Renamed");

        // bootstrap (creates default project/board/columns/task)
        const bootRes = await request
            .post(`/api/v1/organizations/${org._id}/bootstrap`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(bootRes.status).toBe(200);
        expect(bootRes.body.success).toBe(true);
        expect(bootRes.body.data.organization._id).toBe(org._id);
        expect(bootRes.body.data.project).toBeDefined();
        expect(bootRes.body.data.board).toBeDefined();
        expect(Array.isArray(bootRes.body.data.columns)).toBe(true);

        // delete
        const delRes = await request
            .delete(`/api/v1/organizations/${org._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(delRes.status).toBe(200);
        expect(delRes.body.success).toBe(true);
    });
});