const { DEL, GET, PATCH, POST, axios, expect } = require("../app");

describe("TaskLists:", () => {
  let validateStatus;

  beforeAll(() => {
    validateStatus = axios.defaults.validateStatus;
    axios.defaults.validateStatus = (_status) => true;
  });

  afterAll(() => {
    axios.defaults.validateStatus = validateStatus;
  });

  describe.skip("Reading task lists", () => {
    it("succeeds with filter by default task list", async () => {});

    it("succeeds by ID", async () => {});

    it("succeeds with expanded tasks", async () => {});
  });

  describe.skip("Creating task lists", () => {
    it("succeeds with title and color", async () => {});

    it("fails without title", async () => {});

    it("succeeds without color", async () => {});

    it("fails with invalid color", async () => {});

    it("fails with specifying default flag", async () => {});
  });

  describe.skip("Updating task lists", () => {
    it("succeeds with title and color", async () => {});

    it("fails with null title", async () => {});

    it("fails with invalid color", async () => {});

    it("fails with specifying default flag", async () => {});
  });

  describe.skip("Deleting task lists", () => {
    it("succeeds for empty, non-default list", async () => {});

    it("fails for default list", async () => {});

    it("fails when having tasks", async () => {});
  });
});
