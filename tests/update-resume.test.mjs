import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const run = promisify(execFile);
const script = fileURLToPath(new URL('../tools/update-resume.mjs', import.meta.url));
const existingPdf = fileURLToPath(new URL('../assets/resume.pdf', import.meta.url));

test('imports the highest numeric iCloud PDF version and renders its first-page preview', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'resume-import-'));
  try {
    await mkdir(path.join(root, 'assets'));
    const resumes = path.join(root, 'home/Library/Mobile Documents/com~apple~CloudDocs/resumes');
    await mkdir(resumes, { recursive: true });
    await writeFile(path.join(root, 'assets/resume.pdf'), 'previous PDF');
    await writeFile(path.join(root, 'assets/resume-preview.png'), 'previous preview');
    const source = path.join(resumes, 'isaiah_yoon_resume_010.pdf');
    await copyFile(existingPdf, source);
    await writeFile(path.join(resumes, 'isaiah_yoon_resume_9.pdf'), 'older PDF');
    await writeFile(path.join(resumes, 'isaiah_yoon_resume_999.pages'), 'not a PDF');
    const { stdout } = await run(process.execPath, [script], { cwd: root, env: { ...process.env, HOME: path.join(root, 'home') } });
    assert.match(stdout, /isaiah_yoon_resume_010\.pdf/);
    assert.deepEqual(await readFile(path.join(root, 'assets/resume.pdf')), await readFile(source));
    const preview = await readFile(path.join(root, 'assets/resume-preview.png'));
    assert.deepEqual(preview.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    assert.ok(preview.length > 1000);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects missing, ambiguous, and invalid latest PDFs without replacing assets', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'resume-import-'));
  try {
    await mkdir(path.join(root, 'assets'));
    const resumes = path.join(root, 'home/Library/Mobile Documents/com~apple~CloudDocs/resumes');
    await mkdir(resumes, { recursive: true });
    const pdf = path.join(root, 'assets/resume.pdf');
    const preview = path.join(root, 'assets/resume-preview.png');
    await writeFile(pdf, 'existing PDF');
    await writeFile(preview, 'existing preview');
    const update = () => run(process.execPath, [script], { cwd: root, env: { ...process.env, HOME: path.join(root, 'home') } });
    await assert.rejects(update(), /No versioned isaiah_yoon_resume/);
    await copyFile(existingPdf, path.join(resumes, 'isaiah_yoon_resume_001.pdf'));
    await writeFile(path.join(resumes, 'isaiah_yoon_resume_002.pdf'), 'not a PDF');
    await assert.rejects(update(), /Could not render the PDF/);
    await copyFile(existingPdf, path.join(resumes, 'isaiah_yoon_resume_2.pdf'));
    await assert.rejects(update(), /Multiple résumé PDFs have the highest version/);
    assert.equal(await readFile(pdf, 'utf8'), 'existing PDF');
    assert.equal(await readFile(preview, 'utf8'), 'existing preview');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
