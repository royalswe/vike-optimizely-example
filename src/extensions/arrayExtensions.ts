Array.prototype.last = function () {
  const lastIndex = this.length - 1;
  return this[lastIndex];
};

Array.prototype.first = function () {
  if (this) {
    return this[0];
  }
  return null;
};

Array.prototype.sortAlphabetically = function sortAlphabetically<T>(
  property: (arg0: T) => string,
  descending = false
) {
  if (descending) {
    return this.sort((a, b) => -1 * property(a).localeCompare(property(b)));
  }

  return this.sort((a, b) => property(a).localeCompare(property(b)));
};
