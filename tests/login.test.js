import "dotenv/config";
import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import app from "../app-test";
import { User } from "../schemas/users";

mongoose.set("strictQuery", false);

const { DB_TEST_URI } = process.env;

describe("User login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany();
    const hashedPassword = await bcrypt.hash("123456", 10);

    const testUser = await User.create({
      email: "testUser@gmail.com",
      password: hashedPassword,
    });

    await testUser.save();
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_TEST_URI);
  });

  it("should login user and return status code 200", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser@gmail.com",
      password: "123456",
    });
    expect(response.statusCode).toBe(200);
  });

  it("should login user and return token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser@gmail.com",
      password: "123456",
    });
    expect(response.body.token).toBeDefined();
  });

  it("should login user and returt two fieds: email (data type String) and subscription (data type String)", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testUser@gmail.com",
      password: "123456",
    });
    expect(response.body.user.email).toBeDefined();
    expect(typeof response.body.user.email).toBe("string");
    expect(response.body.user.subscription).toBeDefined();
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
