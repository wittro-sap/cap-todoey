const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  const { TaskLists } = this.entities;

  this.before("CREATE", TaskLists, (req) => {
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
});
