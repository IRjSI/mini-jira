import { describe, expect, it } from "vitest";
import { request } from "../setup.js";

describe("Test project routes", () => {
    async function registerCreateOrgAndProject() {
        const user = { name: "Test User", email: "test@test.com", password: "password123" };
        const reg = await request.post("/api/v1/auth/register").send(user);
        const token = reg.body.data.accessToken;

        const orgRes = await request
            .post("/api/v1/organizations")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Org For Projects", description: "o" });

        const org = orgRes.body.data;

        const projectRes = await request
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Project 1", description: "p", organizationId: org._id });

        return { token, org, project: projectRes.body.data };
    }

    it("creates, fetches, updates and deletes a project", async () => {
        const { token, org, project } = await registerCreateOrgAndProject();

        // fetch list
        const listRes = await request
            .get("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`);

        expect(listRes.status).toBe(200);
        expect(Array.isArray(listRes.body.data)).toBe(true);

        // get by id
        const getRes = await request
            .get(`/api/v1/projects/${project._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body.data._id).toBe(project._id);

        // get by organization
        const byOrgRes = await request
            .get(`/api/v1/projects/organization/${org._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(byOrgRes.status).toBe(200);
        expect(Array.isArray(byOrgRes.body.data)).toBe(true);

        // update
        const upd = await request
            .patch(`/api/v1/projects/${project._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated Project" });

        expect(upd.status).toBe(200);
        expect(upd.body.data.name).toBe("Updated Project");

        // delete
        const del = await request
            .delete(`/api/v1/projects/${project._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(del.status).toBe(200);

        // confirm deletion
        const after = await request
            .get(`/api/v1/projects/${project._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(after.status).toBe(404);
    });
});