function getRefName(ref) {
  return ref.ref ? ref.ref.join(".") : undefined;
}

function getRef(name) {
  return { ref: [name] };
}

function getVal(value) {
  return { val: value };
}

module.exports = { getRef, getRefName, getVal };
