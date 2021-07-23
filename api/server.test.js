// Write your tests here
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