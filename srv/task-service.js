const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  const { TaskLists, Tasks } = this.entities;

  const isDefaultTaskList = async (taskListID, req) => {
    const query = cds.ql.SELECT.one(TaskLists)
      .columns("isDefault")
      .where({ ID: taskListID });
    const taskList = await this.tx(req).run(query);
    return taskList.isDefault;
  };

  this.before(["CREATE", "UPDATE"], TaskLists, (req) => {
    const color = req.data.color;
    if (!color) {
      return;
    }
    const isValidHex = color.length === 6 && /[a-fA-F0-9]{6}$/.test(color);
    if (!isValidHex) {
      req.reject(400, `Invalid color hex value '${color}'`);
    }
    req.data.color = color.toUpperCase();
  });

  this.before("UPDATE", TaskLists, async (req) => {
    const data = req.data;
    if (data.title === undefined) {
      return;
    }
    const isDefault = await isDefaultTaskList(data.ID, req);
    if (isDefault) {
      req.reject(400, "Title of default task list cannot be updated.");
    }
  });

  this.before("DELETE", TaskLists, async (req) => {
    const isDefault = await isDefaultTaskList(req.data.ID, req);
    if (isDefault) {
      req.reject(400, "Default task list cannot be deleted.");
    }
  });

  this.after("READ", Tasks, (each) => {
    if (each.dueDateTime !== null) {
      return;
    }
    const { dueDate, dueTime } = each;
    if (!dueDate) {
      return;
    }
    each.dueDateTime = `${dueDate}T${dueTime || "00:00:00"}`;
  });

  this.after("READ", Tasks, (each) => {
    if (each.isCompleted !== null) {
      return;
    }
    const openStatus = "O";
    each.isCompleted = each.status_code !== openStatus;
  });
});
