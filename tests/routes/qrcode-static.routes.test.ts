import { spawn, type Subprocess } from "bun";
import { beforeAll, afterAll, describe, it, expect } from "bun:test";
import { randomUUID } from "crypto";
import { existsSync, rmSync } from "fs";
import { url } from "inspector";
import { resolve } from "path";

const API_URL = "http://localhost:3000";

let serverProcess: Subprocess | undefined;
let capturedApiKey: string | undefined;

const startServerAndCaptureKey = (): Promise<string> => {
    return new Promise((resolve, reject) => {

        serverProcess = spawn({
            cmd: ["bun", "src/server.ts"],
            stdout: "pipe",
            stderr: "pipe",
        });

        if (serverProcess.stdout instanceof ReadableStream) {
            const reader = serverProcess.stdout.getReader();
            const decoder = new TextDecoder();

            const readOutput = async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const logLine = decoder.decode(value);
                        console.log(`[SERVER LOG]: ${logLine.trim()}`);

                        if (logLine.includes("w/ apiKey:")) {
                            const key = logLine.split("apiKey: ")[1]?.trim();
                            if (key) {
                                resolve(key);
                                return;
                            }
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            };
            readOutput();
        } else {
            return reject(new Error("Server process failed to start or stdout is not a readable stream."));
        }

        setTimeout(() => reject(new Error("Server start timed out or API key not found in logs.")), 10000);
    });
};

describe("Self-contained tests for /qrcode-static/", () => {

    beforeAll(async () => {

        console.log("Performing pre-testing cleanup. This will wipe the entire database.")
        const testDbPath = resolve(process.cwd(), 'woovers.sqlite');
        if (existsSync(testDbPath)) {
            rmSync(testDbPath);
            console.log("Removed old database.");
        }

        try {
        console.log("Starting server and capturing API key...");
        capturedApiKey = await startServerAndCaptureKey();
        console.log(`API key captured: ${capturedApiKey}`);
        } catch (error) {
            console.error("Failed to start server for tests:", error);
            process.exit(1);
        }
    });

    afterAll(() => {
        console.log("Stopping server...");
        if (serverProcess) {
            serverProcess.kill();
        }
    });

    describe("GET /qrcode-static/", () => {

        it("should use dynamic key to fetch QR codes", async() => {
            const url = `${API_URL}/api/v1/qrcode-static/`;
            const response = await fetch(url, {
                headers: { "Authorization": `Bearer ${capturedApiKey}`}
            });
            expect(response.status).toBe(200);
        });

        it("should return a 400 Bad Request for non-numeric pagination", async () => {
            const url = `${API_URL}/api/v1/qrcode-static/?page=abc`;
            const response = await fetch(url, { 
                headers: { "Authorization": `Bearer ${capturedApiKey}`}
            });
            expect(response.status).toBe(400);
        })
    });

    describe("GET /qrcode-static/:id", () => {
        it("should return a 404 Not Found for an ID that does not exist", async () => {
            const nonExistentID = "this-id-never-exists-12345"
            const url = `${API_URL}/api/v1/qrcode-static/${nonExistentID}`

            const response = await fetch(url, {
                headers: { "Authorization": `Bearer ${capturedApiKey}` }
            });
            
            expect(response.status).toBe(404);
        })
        it("should return the correct QRcode when a valid ID is provided", async () => {
        const createUrl = `${API_URL}/api/v1/qrcode-static/`;
        const qrCodePayLoad = {
            correlationID: randomUUID(),
            name: "Test QRcode for GET by ID",
            value: 123.45,
            comment: "A test comment"
        };
        
        const createResponse = await fetch(createUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${capturedApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(qrCodePayLoad)
        });

        const responseBody = await createResponse.json();
        
        expect(createResponse.status).toBe(201);
        
        let idToSearch;
        
        try { 
            responseBody.pixQrCode && responseBody.pixQrCode.correlationID 
            idToSearch = responseBody.pixQrCode.correlationID;
        } catch {
            throw new Error("No valid ID found in POST response");
        }

        expect(idToSearch).toBeDefined();

        await new Promise(resolve => setTimeout(resolve, 100));

        const getUrl = `${API_URL}/api/v1/qrcode-static/${idToSearch}`;
        
        const getResponse = await fetch(getUrl, {
            headers: { 
                "Authorization": `Bearer ${capturedApiKey}`,
                "Content-Type": "application/json"
            }
        });

        expect(getResponse.status).toBe(200);
        
        const fetchedQrCode = await getResponse.json();

        const fetchedId = fetchedQrCode.pixQrCode.correlationID;
        const fetchedName = fetchedQrCode.pixQrCode.name;
        
        expect(fetchedId).toBe(idToSearch);
        expect(fetchedName).toBe(qrCodePayLoad.name);
        });
    });
    describe("POST /qrcode-static/", () => {
       it("should fail to create a QR code with a duplicate correlationID", async () => {

            const url = `${API_URL}/api/v1/qrcode-static/`;
            const duplicateIdPayload = {
                correlationID: "this-is-a-static-id-for-the-duplicate-test",
                name: "Duplicate Test",
                value: 1.00,
            };

            const requestOptions = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${capturedApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(duplicateIdPayload)
            };

            const firstResponse = await fetch(url, requestOptions);
            expect(firstResponse.status).toBe(201); 

            const secondResponse = await fetch(url, requestOptions);
            expect(secondResponse.status).toBe(409); 
        });
        it("should return a 400 Bad Request if the request body is invalid", async () => {
            const url = `${API_URL}/api/v1/qrcode-static/`
            const invalidPayload = {};

            const requestOptions = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${capturedApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(invalidPayload)
            };

            const response = await fetch(url, requestOptions);

            expect(response.status).toBe(400);

            const errorBody = await response.json();
            expect(errorBody).toHaveProperty("error");
            console.log("Received expected validation error:", errorBody.error);
        });
    });
});