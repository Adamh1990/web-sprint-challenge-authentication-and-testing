// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const Jokes = require('./jokes/jokes-model')
test('sanity', () => {
  expect(true).not.toBe(false)
})


describe("jokes-model", () => {
	// truncate users
	beforeEach(async () => {
		// empty table and reset primary key back to 1
		await db("users").truncate();
	});

	// testing the add() model
	describe("add()", () => {
		it("should add a user", async () => {
			// make request, send data
			await Jokes.add({
				username: "addTestUsername",
				password: "addTestPassword",
			});

			// check that the new user is in the database(without using GET or route)
			const addTestUsersPresent = await db("users");

			expect(addTestUsersPresent).toHaveLength(1);
			expect(addTestUsersPresent[0].username).toMatch("addTestUsername");
		});
	}); // PASSING

	// testing the findBy() model
	describe("findBy()", () => {
		it("should find a user by id", async () => {
			// step 1 show that the db is empty
			const findbyTestUserPresent1 = await db("users");
			expect(findbyTestUserPresent1).toHaveLength(0);

			// step 2 add an item to the database and prove it exists
			await Jokes.add({
				username: "findByTestUsername",
				password: "findByTestPassword",
			});
			const findbyTestUserPresent2 = await db("users");
			expect(findbyTestUserPresent2).toHaveLength(1);

			// step 3 find the item by ID
			expect(findbyTestUserPresent2[0].id).toBe(1);
		});
	});
});

describe("auth router", () => {
	// truncate database
	beforeEach(async () => {
		// empty table and reset primary key back to 1
		await db("users").truncate();
	});

	// testing the new user registration!
	describe("POST /register", () => {
		it("should add a new user", async () => {
			//step 1 check that users has been truncated
			const RegisterTest1 = await db("users");
			expect(RegisterTest1).toHaveLength(0);

			//step 2 add a user and check if that user exits in database
			await request(server).post("/api/auth/register").send({
				username: "registerTestUsername",
				password: "registerTestPassword",
			});
			const RegisterTest2 = await db("users");
			expect(RegisterTest2).toHaveLength(1);

			////// extra truncate - don't know why but users added through tests seem to be sticking around for some reason
			await db("users").truncate();
		});
	}); // PASSING

	// testing the login of a user!
	describe("POST /login", () => {
		it("should login a user", async () => {
			// step 1 check that users has been truncated
			const LoginTest1 = await db("users");
			expect(LoginTest1).toHaveLength(0);

			// step 2 add a new user to the db and check existance
			await request(server).post("/api/auth/register").send({
				username: "Captain Marvel",
				password: "foobar",
			});
			const LoginTest2 = await db("users");
			expect(LoginTest2).toHaveLength(1);
			expect(LoginTest2[0].username).toMatch("Captain Marvel");

			// step 3 login a user
			let res = await request(server).post("/api/auth/login").send({
				username: "Captain Marvel",
				password: "foobar",
			});
      expect(res.body.message).toMatch(/welcome, Captain Marvel/i)
    }, 500);
		});
	}); // PASSING
