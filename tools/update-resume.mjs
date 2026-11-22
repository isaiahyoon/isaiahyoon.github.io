import { execFile } from 'node:child_process';
import { copyFile, mkdtemp, readFile, readdir, rename, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = process.cwd();
const assets = path.join(root, 'assets');
const resumes = path.join(os.homedir(), 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'resumes');

async function updateResume() {
  const entries = await readdir(resumes, { withFileTypes: true });
  let latest;
  for (const entry of entries) {
    const match = entry.name.match(/^isaiah_yoon_resume_(\d+)\.pdf$/);
    if (!entry.isFile() || !match) continue;
    const version = BigInt(match[1]);
    if (!latest || version > latest.version) latest = { name: entry.name, version, ambiguous: false };
    else if (version === latest.version) latest.ambiguous = true;
  }
  if (!latest) throw new Error(`No versioned isaiah_yoon_resume_<number>.pdf found in ${resumes}.`);
  if (latest.ambiguous) throw new Error(`Multiple résumé PDFs have the highest version (${latest.version}) in ${resumes}.`);

  const temporary = await mkdtemp(path.join(assets, '.resume-update-'));
  try {
    const pdf = path.join(temporary, 'resume.pdf');
    const preview = path.join(temporary, 'resume-preview.png');
    await copyFile(path.join(resumes, latest.name), pdf);
    try {
      await run('pdftoppm', ['-f', '1', '-l', '1', '-r', '144', '-singlefile', '-png', pdf, path.join(temporary, 'resume-preview')]);
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error('pdftoppm is required. Install Poppler before updating the résumé.');
      throw new Error(`Could not render the PDF: ${error.stderr?.trim() || error.message}`);
    }

    const signature = (await readFile(preview)).subarray(0, 8);
    if (!signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      throw new Error('The rendered résumé preview is not a PNG.');
    }
    await rename(preview, path.join(assets, 'resume-preview.png'));
    try {
      await rename(pdf, path.join(assets, 'resume.pdf'));
    } catch (error) {
      throw new Error(`The preview was updated, but the résumé PDF could not be replaced: ${error.message}`);
    }
    console.log(`Updated résumé and first-page preview from ${latest.name}.`);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

updateResume().catch(error => {
  console.error(`Résumé update failed: ${error.message}`);
  process.exitCode = 1;
});
