const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  const { TaskLists } = this.entities;

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

    const query = cds.ql.SELECT.one(TaskLists)
      .columns("isDefault")
      .where({ ID: data.ID });
    const taskList = await this.tx(req).run(query);

    if (taskList.isDefault) {
      req.reject(400, "Title of default task list cannot be updated.");
    }
  });
});
