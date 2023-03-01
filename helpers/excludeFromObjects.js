const excludeFromObject = (objectInput, excludedFields) => {
  Object.keys(objectInput).forEach((key) => {
    if (excludedFields.indexOf(key) != -1) {
      delete objectInput[key];
    }
  });

  return objectInput;
};

module.exports = excludeFromObject;
