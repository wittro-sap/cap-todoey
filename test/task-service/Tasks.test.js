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

    it("succeeds with filter by date range", async () => {});

    it("succeeds with filtering completion flag", async () => {
      const {
        status,
        data,
      } = await GET`/task/Tasks?$select=ID&$filter=isCompleted ne true`;
      expect(status).to.equal(200);
      expect(data.value).not.to.be.an("undefined");
      expect(data.value).to.deep.members([
        { ID: "d3183e36-648f-433e-89d5-df89a9e37b54" },
        { ID: "f5d7d997-420d-428d-b5bf-348780f5cf08" },
      ]);
      expect(data.value).not.to.deep.members([
        { ID: "a74ddb9a-5bd6-481a-aba3-9737ec37ed99" },
        { ID: "66b4f1ed-6379-412a-aefc-c0e951bc56ea" },
      ]);
    });

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
