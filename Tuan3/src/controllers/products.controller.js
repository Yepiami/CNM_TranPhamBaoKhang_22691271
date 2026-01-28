
import * as repo from '../services/products.repo.local.js';
import { getPublicUrl } from '../services/storage.local.js';

export async function listPage(req, res) {
    const products = await repo.listProducts();
    res.render('products/index', { title: 'Quản lý sản phẩm', products });
}

export function newPage(req, res) {
    res.render('products/new', { title: 'Thêm sản phẩm', error: null, values: {} });
}

export async function createAction(req, res) {
    try {
        const { name, price, quantity } = req.body;
        if (!name || !price || !quantity) {
            return res.render('products/new', {
                title: 'Thêm sản phẩm',
                error: 'Vui lòng nhập đủ Name/Price/Quantity',
                values: req.body
            });
        }
        let url_image = '';
        if (req.file) {
            url_image = getPublicUrl(req.file.filename, process.env.APP_BASE_URL);
        }
        await repo.createProduct({ name, price, quantity, url_image });
        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Lỗi tạo sản phẩm: ' + err.message);
    }
}

export async function editPage(req, res) {
    const product = await repo.getProduct(req.params.id);
    if (!product) return res.status(404).send('Không tìm thấy');
    res.render('products/edit', { title: 'Chỉnh sửa sản phẩm', product, error: null });
}

export async function updateAction(req, res) {
    try {
        const { name, price, quantity } = req.body;
        const patch = { name, price: Number(price), quantity: Number(quantity) };
        if (req.file) {
            patch.url_image = getPublicUrl(req.file.filename, process.env.APP_BASE_URL);
        }
        const updated = await repo.updateProduct(req.params.id, patch);
        if (!updated) return res.status(404).send('Không tìm thấy');
        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Lỗi cập nhật: ' + err.message);
    }
}

export async function deleteAction(req, res) {
    await repo.deleteProduct(req.params.id);
    res.redirect('/products');
}
