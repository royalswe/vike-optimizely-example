String.prototype.toAbsoluteUrl = function (): string {
  const absoluteUrl = this && this.indexOf('http') === -1 ? import.meta.env.VITE_API_BASE_URL + this : this;
  return absoluteUrl;
};

String.prototype.toHypenCase = function (): string {
  let stringToTransform = this;
  // Return empty string if string is null or empty
  if (!stringToTransform) {
    return '';
  }

  // Add - before capital letter
  stringToTransform = stringToTransform
    .trimEnd()
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()
    .toLowerCase();

  const number = stringToTransform.match(/(\d+)/);
  if (!number) {
    return stringToTransform as string;
  }
  stringToTransform = stringToTransform.replaceAll(number[0], '-' + number[0]);
  return stringToTransform as string;
};
