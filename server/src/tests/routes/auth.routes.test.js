import { describe, expect, it } from "vitest";
import { request } from "../setup.js";

describe("Test auth routes", () => {
    it("registers a new user successfully", async () => {
        const newUserData = {
            name: "Test User",
            email: "test@test.com",
            password: "password123",
        };

        const res = await request.post("/api/v1/auth/register").send(newUserData);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toEqual(newUserData.email);
        expect(typeof res.body.data.user._id).toBe("string");
    });

    it("logs in an existing user successfully", async () => {
        const newUserData = {
            name: "Test User",
            email: "test@test.com",
            password: "password123",
        };

        await request.post("/api/v1/auth/register").send(newUserData);

        const res = await request.post("/api/v1/auth/login").send({
            email: newUserData.email,
            password: newUserData.password,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toEqual(newUserData.email);
        expect(typeof res.body.data.accessToken).toBe("string");
    });

    it("returns the current user for an authenticated request", async () => {
        const newUserData = {
            name: "Test User",
            email: "test@test.com",
            password: "password123",
        };

        const registerRes = await request.post("/api/v1/auth/register").send(newUserData);
        const accessToken = registerRes.body.data.accessToken;

        const res = await request
            .get("/api/v1/auth/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toEqual(newUserData.email);
    });
});