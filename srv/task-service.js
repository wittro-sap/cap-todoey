const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  const { TaskLists, Tasks, TaskCollections } = this.entities;

  const isDefaultTaskList = async (taskListID, req) => {
    const query = cds.ql.SELECT.one(TaskLists)
      .columns("isDefault")
      .where({ ID: taskListID });
    const taskList = await this.tx(req).run(query);
    return taskList.isDefault;
  };

  const taskStatusOpen = "O";

  const isCompleted = (status) => status !== taskStatusOpen;

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

  this.before("CREATE", Tasks, (req) => {
    const { dueDate, dueTime } = req.data;
    if (!dueDate && dueTime) {
      req.reject(400, "Due date is mandatory if due time is defined.");
    }
  });

  this.before("CREATE", Tasks, (req) => {
    const data = req.data;
    data.status_code = taskStatusOpen;
    data.isCompleted = isCompleted(taskStatusOpen);
  });

  this.before("UPDATE", Tasks, async (req) => {
    const status = req.data.status_code;
    if (status) {
      req.data.isCompleted = isCompleted(status);
    }
  });

  this.before("UPDATE", Tasks, async (req) => {
    const { ID, dueDate, dueTime } = req.data;
    if (dueDate === null) {
      req.data.dueTime = null;
      return;
    }
    if (dueDate || !dueTime) {
      return;
    }

    const query = cds.ql.SELECT.one(Tasks).columns("dueDate").where({ ID });
    const task = await this.tx(req).run(query);
    if (!task.dueDate) {
      req.reject(400, "Due date is mandatory if due time is defined.");
    }
  });

  this.on("getDefaultTaskList", (_req) => {
    return cds.ql.SELECT.one(TaskLists).where({ isDefault: true });
  });

  this.on("READ", TaskCollections, async (req, next) => {
    return next(req);
  });

  this.on("READ", Tasks, async (req, next) => {
    return next(req);
  });
});
