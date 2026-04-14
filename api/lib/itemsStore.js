import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { list, put } from '@vercel/blob';

const ITEMS_BLOB_PATH = 'data/items.json';
const LOCAL_ITEMS_PATH = path.join(process.cwd(), 'data', 'items.local.json');

export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readItemsFromBlob() {
  const { blobs } = await list({ prefix: 'data/items' });
  if (blobs.length === 0) return [];

  const itemsBlob = blobs.find((b) => b.pathname === ITEMS_BLOB_PATH);
  if (!itemsBlob) return [];

  const response = await fetch(itemsBlob.url);
  if (!response.ok) return [];

  const items = await response.json();
  return Array.isArray(items) ? items : [];
}

async function writeItemsToBlob(items) {
  return put(ITEMS_BLOB_PATH, JSON.stringify(items, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

async function readItemsFromLocalFile() {
  try {
    const raw = await readFile(LOCAL_ITEMS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeItemsToLocalFile(items) {
  await mkdir(path.dirname(LOCAL_ITEMS_PATH), { recursive: true });
  await writeFile(LOCAL_ITEMS_PATH, JSON.stringify(items, null, 2), 'utf8');
}

export async function getItems() {
  if (hasBlobToken()) {
    return readItemsFromBlob();
  }
  return readItemsFromLocalFile();
}

export async function saveItems(items) {
  if (hasBlobToken()) {
    return writeItemsToBlob(items);
  }
  await writeItemsToLocalFile(items);
  return { pathname: 'data/items.local.json', url: null };
}
