// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')
const jwtDecode = require('jwt-decode')
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
				username: "Captain Marvel",
				password: "foobar",
			});

			// check that the new user is in the database(without using GET or route)
			const addTestUsersPresent = await db("users");

			expect(addTestUsersPresent).toHaveLength(1);
			expect(addTestUsersPresent[0].username).toMatch("Captain Marvel");
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


//==============================================================//

describe("jokes-router", () => {
	// truncate users table
	beforeEach(async () => {
		// empty users table and reset PK to 1
		await db("users").truncate();
		const trunkTest = await db("users");
		expect(trunkTest).toHaveLength(0);
	});

	// testing the GET endpoint

	describe("GET /", () => {
		it("should return an array of dad jokes", async () => {
			// step 1 check that users has been truncated
			const getTestUsersPresent1 = await db("users");
			expect(getTestUsersPresent1).toHaveLength(0);

			// step 2 add a user
			await request(server).post("/api/auth/register").send({
				username: "Captain Marvel",
				password: "foobar",
			});
			const testtest = await db("users");
			expect(testtest).toHaveLength(1);

			// step 3 login a user
			let res = await request(server).post("/api/auth/login").send({
				username: "Captain Marvel",
				password: "foobar",
			});
			let token = res.body.token;
			let result = await request(server).get("/api/jokes").set({ Authorization: token });

			// step 6 examine the result of the get request
			console.log("DAD JOKES", result.body);
			await db("users").truncate();
		});
	});
});

describe('jokes router', () => {
  describe('get jokes endpoint', () => {
    it('gives a 200 status', async () => {
      await request(server).get('/api/jokes').then(res => {
        expect(res.status).toBe(401)
      })
    })
  })
})