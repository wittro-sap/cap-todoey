const { GET, expect } = require("../app");

describe("Endpoint", () => {
  it("serves $metadata", async () => {
    const { headers, status } = await GET`/task/$metadata`;
    expect(status).to.equal(200);
    expect(headers).to.contain({
      "content-type": "application/xml",
      "odata-version": "4.0",
    });
  });

  it("serves service document", async () => {
    const { status, data } = await GET`/task`;
    expect(status).to.equal(200);
    expect(data).to.deep.include({ "@odata.context": "$metadata" });
    expect(data.value).not.to.be.an("undefined");
    expect(data.value).to.deep.members([
      {
        name: "Tasks",
        url: "Tasks",
      },
      {
        name: "TaskCollections",
        url: "TaskCollections",
      },
      {
        name: "TaskLists",
        url: "TaskLists",
      },
      {
        name: "TaskPriorityCodes",
        url: "TaskPriorityCodes",
      },
      {
        name: "TaskStatusCodes",
        url: "TaskStatusCodes",
      },
    ]);
  });
});
