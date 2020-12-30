const { DEL, GET, PATCH, POST, axios, expect } = require("../app");

describe("Tasks:", () => {
  let validateStatus;

  beforeAll(() => {
    validateStatus = axios.defaults.validateStatus;
    axios.defaults.validateStatus = (_status) => true;
  });

  afterAll(() => {
    axios.defaults.validateStatus = validateStatus;
  });

  describe.skip("Reading tasks", () => {
    it("succeeds by ID", async () => {});

    it("succeeds with search by title", async () => {});

    it("succeeds with filter by task list", async () => {});

    it("succeeds with filter by priorities", async () => {});

    it("succeeds with filter by date range", async () => {});

    it("succeeds with filtering completion flag", async () => {});

    it("succeeds with ordering by date descending", async () => {});
  });

  describe.skip("Creating tasks", () => {
    it("succeeds with title, task list, priority", async () => {});

    it("fails without task list", async () => {});

    it("fails with invalid priority", async () => {});

    it("succeeds with due date and time", async () => {});

    it("fails with due time but no date", async () => {});

    it("succeeds with ignoring status when specified", async () => {});
  });

  describe.skip("Updating tasks", () => {});

  describe.skip("Deleting tasks", () => {});

  describe.skip("Setting task status", () => {});
});
