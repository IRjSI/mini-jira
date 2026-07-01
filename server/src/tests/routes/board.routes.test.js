import { describe, expect, it } from "vitest";
import { request } from "../setup.js";

describe("Test board routes", () => {
    async function registerAndBootstrap() {
        const user = {
            name: "Test User",
            email: "test@test.com",
            password: "password123",
        };

        const registerRes = await request.post("/api/v1/auth/register").send(user);
        const accessToken = registerRes.body.data.accessToken;

        // create an organization
        const orgRes = await request
            .post("/api/v1/organizations")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "Test Org", description: "Org desc" });

        const organization = orgRes.body.data;

        // create a project under the organization
        const projectRes = await request
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "Test Project", description: "Proj desc", organizationId: organization._id });

        const project = projectRes.body.data;

        return { accessToken, organization, project };
    }

    it("creates a new board successfully", async () => {
        const { accessToken, project } = await registerAndBootstrap();

        const newBoardData = {
            name: "Test Board",
            description: "Test Board Description.",
        };

        const res = await request
            .post(`/api/v1/projects/${project._id}/boards`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(newBoardData);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(newBoardData.name);
        expect(typeof res.body.data._id).toBe("string");
    });

    it("fetches boards for a project", async () => {
        const { accessToken, project } = await registerAndBootstrap();

        const boardNames = ["B1", "B2", "B3"];

        for (const name of boardNames) {
            await request
                .post(`/api/v1/projects/${project._id}/boards`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ name, description: "desc" });
        }

        const res = await request
            .get(`/api/v1/projects/${project._id}/boards`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(3);
    });

    it("fetches, updates and deletes a board", async () => {
        const { accessToken, project } = await registerAndBootstrap();

        const createRes = await request
            .post(`/api/v1/projects/${project._id}/boards`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "To Update", description: "desc" });

        const board = createRes.body.data;

        // fetch
        const fetchRes = await request
            .get(`/api/v1/boards/${board._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(fetchRes.status).toBe(200);
        expect(fetchRes.body.success).toBe(true);
        expect(fetchRes.body.data._id).toBe(board._id);

        // update
        const updateRes = await request
            .patch(`/api/v1/boards/${board._id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ name: "Updated Name" });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body.success).toBe(true);
        expect(updateRes.body.data.name).toBe("Updated Name");

        // delete
        const delRes = await request
            .delete(`/api/v1/boards/${board._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(delRes.status).toBe(200);
        expect(delRes.body.success).toBe(true);

        // confirm deletion
        const afterDel = await request
            .get(`/api/v1/boards/${board._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(afterDel.status).toBe(404);
        expect(afterDel.body.success).toBe(false);
    });
});