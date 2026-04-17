// tests/cli/commands.test.ts
import { formatScanResult, runScan } from '../../src/cli/commands';

describe('CLI commands', () => {
  test('formatScanResult returns readable string', () => {
    expect(formatScanResult('/tmp', 5)).toBe('Scanned 5 items in /tmp');
  });

  test('runScan returns expected shape in dryRun', async () => {
    const res = await runScan('/tmp', { dryRun: true });
    expect(res).toHaveProperty('path', '/tmp');
    expect(res).toHaveProperty('count');
    expect(res.dryRun).toBe(true);
  });
});