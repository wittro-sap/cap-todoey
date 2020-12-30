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

  describe("Reading task lists", () => {
    it("succeeds with filter by default task list", async () => {
      const {
        status,
        data,
      } = await GET`/task/TaskLists?$filter=isDefault eq true`;
      expect(status).to.equal(200);
      expect(data.value).not.to.be.an("undefined");
      expect(data.value).to.deep.members([
        {
          ID: "00000000-0000-0000-0000-000000000000",
          title: "My Tasks",
          color: "0000FF",
          isDefault: true,
        },
      ]);
    });

    it("succeeds by ID", async () => {
      const {
        status,
        data,
      } = await GET`/task/TaskLists/00000000-0000-0000-0000-000000000000`;
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "00000000-0000-0000-0000-000000000000",
        title: "My Tasks",
        color: "0000FF",
        isDefault: true,
      });
    });

    it("succeeds with expanded tasks", async () => {
      const {
        status,
        data,
      } = await GET`/task/TaskLists/00000000-0000-0000-0000-000000000000?$select=ID&$expand=tasks`;
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "00000000-0000-0000-0000-000000000000",
        tasks: [
          {
            ID: "66b4f1ed-6379-412a-aefc-c0e951bc56ea",
            title: "Do laundry",
            taskList: { ID: "00000000-0000-0000-0000-000000000000" },
            priority: null,
            dueDate: null,
            dueTime: null,
            dueDateTime: null,
            status: { code: "C" },
            isCompleted: null,
          },
          {
            ID: "a74ddb9a-5bd6-481a-aba3-9737ec37ed99",
            title: "Plan vacation",
            taskList: { ID: "00000000-0000-0000-0000-000000000000" },
            priority: null,
            dueDate: null,
            dueTime: null,
            dueDateTime: null,
            status: { code: "X" },
            isCompleted: null,
          },
          {
            ID: "d3183e36-648f-433e-89d5-df89a9e37b54",
            title: "Shop groceries",
            taskList: { ID: "00000000-0000-0000-0000-000000000000" },
            priority: null,
            dueDate: null,
            dueTime: null,
            dueDateTime: null,
            status: { code: "O" },
            isCompleted: null,
          },
        ],
      });
    });
  });

  describe("Creating task lists", () => {
    it("succeeds with title and color", async () => {
      const { status, data } = await POST(`/task/TaskLists`, {
        title: "Testing",
        color: "f58a0e",
      });
      expect(status).to.equal(201);
      expect(data).to.deep.include({
        title: "Testing",
        color: "F58A0E",
        isDefault: false,
      });
    });

    it("fails without title", async () => {
      const { status } = await POST(`/task/TaskLists`, { title: null });
      expect(status).to.equal(400);
    });

    it("succeeds without color", async () => {
      const { status, data } = await POST(`/task/TaskLists`, {
        title: "Testing",
      });
      expect(status).to.equal(201);
      expect(data).to.deep.include({
        title: "Testing",
        color: null,
        isDefault: false,
      });
    });

    it("fails with invalid color", async () => {
      const { status } = await POST(`/task/TaskLists`, {
        title: "Testing",
        color: "ABCXYZ",
      });
      expect(status).to.equal(400);
    });

    it("succeeds with ignoring default flag when specified", async () => {
      const { status, data } = await POST(`/task/TaskLists`, {
        title: "Testing",
        isDefault: true,
      });
      expect(status).to.equal(201);
      expect(data).to.deep.include({
        title: "Testing",
        color: null,
        isDefault: false,
      });
    });
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
