const { DEL, GET, PATCH, POST, axios, expect } = require("../app");

describe("TaskPriorityCodes:", () => {
  let validateStatus;

  beforeAll(() => {
    validateStatus = axios.defaults.validateStatus;
    axios.defaults.validateStatus = (_status) => true;
  });

  afterAll(() => {
    axios.defaults.validateStatus = validateStatus;
  });

  it("Reading all task priority codes succeeds", async () => {
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

  it("Reading a single task priority code succeeds", async () => {
    const { status, data } = await GET`/task/TaskPriorityCodes/2`;
    expect(status).to.equal(200);
    expect(data).to.deep.include({
      code: 2,
      name: "High",
    });
  });

  it("Reading task priority with unknown code fails", async () => {
    const { status } = await GET`/task/TaskPriorityCodes/0`;
    expect(status).to.equal(404);
  });

  it("Creating a task priority code fails", async () => {
    const { status } = await POST(`/task/TaskPriorityCodes`, {
      code: 0,
      name: "Unknown",
    });
    expect(status).to.equal(405);
  });

  it("Updating a task priority code fails", async () => {
    const { status } = await PATCH(`/task/TaskPriorityCodes/2`, {
      name: "Moderate",
    });
    expect(status).to.equal(405);
  });

  it("Deleting a task priority code fails", async () => {
    const { status } = await DEL`/task/TaskPriorityCodes/1`;
    expect(status).to.equal(405);
  });
});
