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

  describe("Reading tasks", () => {
    it("succeeds by ID", async () => {
      const {
        status,
        data,
      } = await GET`/task/Tasks/d3183e36-648f-433e-89d5-df89a9e37b54`;
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "d3183e36-648f-433e-89d5-df89a9e37b54",
        title: "Shop groceries",
        taskList: { ID: "b999c57b-facd-4112-921e-90a51664f29d" },
        priority: { code: 4 },
        dueDate: "2020-12-29",
        dueTime: "09:30:00",
        status: { code: "O" },
        isCompleted: false,
        isDueToday: false,
      });
    });

    it("succeeds with search by title", async () => {
      const {
        status,
        data,
      } = await GET`/task/Tasks?$select=title&$search=Plan`;
      expect(status).to.equal(200);
      expect(data.value).not.to.be.an("undefined");
      expect(data.value).to.deep.members([
        {
          ID: "a74ddb9a-5bd6-481a-aba3-9737ec37ed99",
          title: "Plan vacation",
        },
        {
          ID: "f5d7d997-420d-428d-b5bf-348780f5cf08",
          title: "Content brainstorming & Planning",
        },
      ]);
    });

    it("succeeds with filter by task list", async () => {
      const {
        status,
        data,
      } = await GET`/task/Tasks?$select=ID&$filter=taskList/ID eq b999c57b-facd-4112-921e-90a51664f29d`;
      expect(status).to.equal(200);
      expect(data.value).not.to.be.an("undefined");
      expect(data.value).to.deep.members([
        { ID: "d3183e36-648f-433e-89d5-df89a9e37b54" },
        { ID: "a74ddb9a-5bd6-481a-aba3-9737ec37ed99" },
        { ID: "66b4f1ed-6379-412a-aefc-c0e951bc56ea" },
      ]);
    });

    it("succeeds with filter by priorities", async () => {
      const {
        status,
        data,
      } = await GET`/task/Tasks?$select=ID&$filter=priority/code eq 1 or priority/code eq 2`;
      expect(status).to.equal(200);
      expect(data.value).not.to.be.an("undefined");
      expect(data.value).to.deep.members([
        { ID: "a74ddb9a-5bd6-481a-aba3-9737ec37ed99" },
        { ID: "f5d7d997-420d-428d-b5bf-348780f5cf08" },
      ]);
      expect(data.value).not.to.deep.members([
        { ID: "d3183e36-648f-433e-89d5-df89a9e37b54" },
        { ID: "66b4f1ed-6379-412a-aefc-c0e951bc56ea" },
      ]);
    });

    it("succeeds with filter by date range", async () => {
      const {
        status,
        data,
      } = await GET`/task/Tasks?$select=ID&$filter=dueDate ge 2021-01-01 and dueDate le 2021-01-14`;
      expect(status).to.equal(200);
      expect(data.value).not.to.be.an("undefined");
      expect(data.value.length).to.equal(3);
      expect(data.value).to.deep.members([
        { ID: "ae7e6477-b195-436a-b1c4-96b3d03053f0" },
        { ID: "5b0384ec-1621-40cd-ad9e-5baff7fa0aca" },
        { ID: "89e257d8-f909-4d03-9a5f-21271e4a5027" },
      ]);
    });
  });

  describe("Creating tasks", () => {
    it("succeeds with title, task list, priority", async () => {
      const { status, data } = await POST(`/task/Tasks`, {
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        priority: { code: 2 },
      });
      expect(status).to.equal(201);
      expect(data).to.deep.include({
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        priority: { code: 2 },
        dueDate: null,
        dueTime: null,
        status: { code: "O" },
        isCompleted: false,
        isDueToday: false,
      });
    });

    it("fails without task list", async () => {
      const { status } = await POST(`/task/Tasks`, { title: "Testing" });
      expect(status).to.equal(400);
    });

    it("fails with invalid priority", async () => {
      const { status } = await POST(`/task/Tasks`, {
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        priority: { code: 0 },
      });
      expect(status).to.equal(400);
    });

    it("succeeds with due date and time", async () => {
      const { status, data } = await POST(`/task/Tasks`, {
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        dueDate: "2021-01-02",
        dueTime: "21:00:00",
      });
      expect(status).to.equal(201);
      expect(data).to.deep.include({
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        priority: null,
        dueDate: "2021-01-02",
        dueTime: "21:00:00",
        status: { code: "O" },
        isCompleted: false,
        isDueToday: false,
      });
    });

    it("succeeds with due date and no time", async () => {
      const { status, data } = await POST(`/task/Tasks`, {
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        dueDate: "2021-01-02",
        dueTime: null,
      });
      expect(status).to.equal(201);
      expect(data).to.deep.include({
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        priority: null,
        dueDate: "2021-01-02",
        dueTime: null,
        status: { code: "O" },
        isCompleted: false,
        isDueToday: false,
      });
    });

    it("fails with due time but no date", async () => {
      const { status, data } = await POST(`/task/Tasks`, {
        title: "Testing",
        taskList: { ID: "00000000-0000-0000-0000-000000000000" },
        dueDate: null,
        dueTime: "21:00:00",
      });
      expect(status).to.equal(400);
    });
  });

  describe("Updating tasks", () => {
    it("succeeds with title and priority", async () => {
      const { status, data } = await PATCH(
        `/task/Tasks/ae7e6477-b195-436a-b1c4-96b3d03053f0`,
        {
          title: "Testing",
          priority: { code: 2 },
        }
      );
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "ae7e6477-b195-436a-b1c4-96b3d03053f0",
        title: "Testing",
        taskList: { ID: "e24b505c-d5b8-4dae-b0fc-9f46e454fb9f" },
        priority: { code: 2 },
        dueDate: "2021-01-02",
        dueTime: "17:00:00",
        status: { code: "O" },
        isCompleted: false,
        isDueToday: false,
      });
    });

    it("fails without title", async () => {
      const { status } = await PATCH(
        `/task/Tasks/ae7e6477-b195-436a-b1c4-96b3d03053f0`,
        {
          title: null,
        }
      );
      expect(status).to.equal(400);
    });

    it("fails without task list", async () => {
      const { status } = await PATCH(
        `/task/Tasks/ae7e6477-b195-436a-b1c4-96b3d03053f0`,
        {
          taskList: null,
        }
      );
      expect(status).to.equal(400);
    });

    it("succeeds without priority", async () => {
      const { status, data } = await PATCH(
        `/task/Tasks/5b0384ec-1621-40cd-ad9e-5baff7fa0aca`,
        {
          priority: null,
        }
      );
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "5b0384ec-1621-40cd-ad9e-5baff7fa0aca",
        title: "Setup media",
        taskList: { ID: "e24b505c-d5b8-4dae-b0fc-9f46e454fb9f" },
        priority: null,
        status: { code: "O" },
        isCompleted: false,
      });
    });

    it("succeeds by nulling due time when due date is nulled", async () => {
      const { status, data } = await PATCH(
        `/task/Tasks/89e257d8-f909-4d03-9a5f-21271e4a5027`,
        {
          dueDate: null,
        }
      );
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "89e257d8-f909-4d03-9a5f-21271e4a5027",
        dueDate: null,
        dueTime: null,
      });
    });

    it("fails with due time but no date", async () => {
      const { status } = await PATCH(
        `/task/Tasks/f5d7d997-420d-428d-b5bf-348780f5cf08`,
        {
          dueTime: "18:45:00",
        }
      );
      expect(status).to.equal(400);
    });

    it("succeeds with status", async () => {
      const { status, data } = await PATCH(
        `/task/Tasks/89e257d8-f909-4d03-9a5f-21271e4a5027`,
        {
          status: { code: "X" },
        }
      );
      expect(status).to.equal(200);
      expect(data).to.deep.include({
        ID: "89e257d8-f909-4d03-9a5f-21271e4a5027",
        status: { code: "X" },
        isCompleted: true,
      });
    });
  });

  describe("Deleting tasks", () => {
    it("succeeds for cancelled tasks", async () => {
      const {
        status,
      } = await DEL`/task/Tasks/98e69d3b-0bca-4784-8bd8-b5230add74ec`;
      expect(status).to.equal(204);
      const get = await GET`/task/Tasks/98e69d3b-0bca-4784-8bd8-b5230add74ec`;
      expect(get.status).to.equal(404);
    });
  });
});
