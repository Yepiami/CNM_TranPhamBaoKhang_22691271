
// src/services/products.repo.local.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Đường dẫn DB cố định theo kiến trúc project
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'products.json');

// 👉 In ra đường dẫn ngay khi module được load (để debug)
console.log('[DB] Using JSON file at:', DB_PATH);

async function ensureDbFile() {
    try {
        await fs.access(DB_PATH); // Đã tồn tại
    } catch {
        // Chưa có: tạo thư mục + tạo file rỗng "[]"
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
        await fs.writeFile(DB_PATH, '[]', 'utf-8');
        console.log('[DB] Created missing DB file:', DB_PATH);
    }
}

async function readAll() {
    await ensureDbFile();
    const text = await fs.readFile(DB_PATH, 'utf-8');
    try {
        return JSON.parse(text || '[]');
    } catch (e) {
        // Nếu JSON bị hỏng → phục hồi về [] để app còn chạy được
        console.error('[DB] Corrupted JSON, resetting to []:', e.message);
        await fs.writeFile(DB_PATH, '[]', 'utf-8');
        return [];
    }
}

async function writeAll(items) {
    await ensureDbFile();
    await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

export async function listProducts() {
    return await readAll();
}

export async function createProduct({ name, price, quantity, url_image }) {
    const item = {
        id: uuid(),
        name,
        price: Number(price),
        quantity: Number(quantity),
        url_image
    };
    const items = await readAll();
    items.push(item);
    await writeAll(items);
    return item;
}

export async function getProduct(id) {
    const items = await readAll();
    return items.find(p => p.id === id) || null;
}

export async function updateProduct(id, patch) {
    const items = await readAll();
    const idx = items.findIndex(p => p.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    await writeAll(items);
    return items[idx];
}

export async function deleteProduct(id) {
    const items = await readAll();
    const remain = items.filter(p => p.id !== id);
    const deleted = remain.length !== items.length;
    await writeAll(remain);
    return deleted;
}
