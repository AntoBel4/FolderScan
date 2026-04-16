import { Command } from 'commander';
const program = new Command();

program
  .name('folderscope')
  .description('FolderScope AI - CLI')
  .version('0.1.0');

program
  .command('scan <path>')
  .description('Scan a folder and generate reports')
  .option('--dry-run', 'Do not write files')
  .action((path, opts) => {
    console.log('Stub: scan', path, opts);
    process.exit(0);
  });

program
  .command('report')
  .description('Generate global report')
  .action(() => {
    console.log('Stub: report');
    process.exit(0);
  });

program.parse(process.argv);
