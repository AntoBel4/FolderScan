// src/cli/commands.ts
export function formatScanResult(path: string, count: number) {
  return `Scanned ${count} items in ${path}`;
}

export async function runScan(path: string, options: { dryRun?: boolean } = {}) {
  // stub : remplacer par l'implémentation réelle du scanner
  const fakeCount = 3;
  if (options.dryRun) {
    return { path, count: fakeCount, dryRun: true };
  }
  return { path, count: fakeCount, dryRun: false };
}