function scanFolder(path) {
  console.log('Scanning:', path);
  return { files: [], count: 0 };
}

module.exports = { scanFolder };