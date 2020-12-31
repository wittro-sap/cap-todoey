const cds = require("@sap/cds");
const cxn = require("../util/cxn");

const taskStatusOpen = "O";

module.exports = cds.service.impl(function () {
  const { TaskLists, Tasks } = this.entities;

  const isDefaultTaskList = async (taskListID, req) => {
    const query = cds.ql.SELECT.one(TaskLists)
      .columns("isDefault")
      .where({ ID: taskListID });
    const taskList = await this.tx(req).run(query);
    return taskList.isDefault;
  };

  this.before("READ", Tasks, (req) => {
    const where = req.query.SELECT.where || [];
    for (let i = 0; i < where.length; i++) {
      if (cxn.getRefName(where[i]) === "isCompleted") {
        where[i] = cxn.getRef("status_code");
        if (where[i + 1] === "=" || where[i + 1] === "!=") {
          const isCompleted = where[i + 2].val;
          where[i + 1] =
            where[i + 1] === "!="
              ? isCompleted
                ? "="
                : "!="
              : isCompleted
              ? "!="
              : "=";
          where[i + 2] = cxn.getVal(taskStatusOpen);
        }
      }
    }
  });

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
    if (each.isCompleted !== null) {
      return;
    }
    each.isCompleted = each.status_code !== taskStatusOpen;
  });
});
