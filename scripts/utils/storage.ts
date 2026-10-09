import fs from 'node:fs/promises';

export async function saveFile(
  path: string,
  filename: string,
  content: object,
) {
  const fullPath = `${path}/${filename}`;

  const promise = fs.writeFile(fullPath, JSON.stringify(content, null, 2));

  console.log(`File generated at ${fullPath}`);

  return promise;
}
