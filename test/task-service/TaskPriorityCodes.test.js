const { DEL, GET, PATCH, POST, axios, expect } = require("../app");

describe("TaskPriorityCodes", () => {
  let validateStatus;

  beforeAll(() => {
    validateStatus = axios.defaults.validateStatus;
    axios.defaults.validateStatus = (_status) => true;
  });

  afterAll(() => {
    axios.defaults.validateStatus = validateStatus;
  });

  it("gets all task priority codes", async () => {
    const { status, data } = await GET`/task/TaskPriorityCodes`;
    expect(status).to.equal(200);
    expect(data.value).not.to.be.an("undefined");
    expect(data.value).to.deep.members([
      { code: 1, name: "Very high" },
      { code: 2, name: "High" },
      { code: 3, name: "Medium" },
      { code: 4, name: "Low" },
    ]);
  });

  it("gets a single task priority code", async () => {
    const { status, data } = await GET`/task/TaskPriorityCodes/2`;
    expect(status).to.equal(200);
    expect(data).to.deep.include({
      code: 2,
      name: "High",
    });
  });

  it("cannot get task priority with unknown code", async () => {
    const { status } = await GET`/task/TaskPriorityCodes/0`;
    expect(status).to.equal(404);
  });

  it("cannot create a task priority code", async () => {
    const { status } = await POST(`/task/TaskPriorityCodes`, {
      code: 0,
      name: "Unknown",
    });
    expect(status).to.equal(405);
  });

  it("cannot update a task priority code", async () => {
    const { status } = await PATCH(`/task/TaskPriorityCodes/2`, {
      name: "Moderate",
    });
    expect(status).to.equal(405);
  });

  it("cannot delete a task priority code", async () => {
    const { status } = await DEL`/task/TaskPriorityCodes/1`;
    expect(status).to.equal(405);
  });
});
