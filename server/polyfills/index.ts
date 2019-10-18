export async function importPollyfills() {
  const promises = [];
  if (!Array.prototype.includes) promises.push(import('./array.prototype.includes'));
  return Promise.all(promises);
}
