import express from 'express';
// Importación de servicios (Capa de Lógica)
import * as catService from './services/categoryService.js';
import * as prodService from './services/productService.js';
import * as ordService from './services/orderService.js';
import { getPokemonData } from './services/pokemonService.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 📁 1. CATEGORIES API
// ==========================================
app.get('/categories', async (req, res) => res.json(await catService.getAllCategories()));
app.get('/categories/:id', async (req, res) => res.json(await catService.getCategoryById(req.params.id)));
app.post('/categories', async (req, res) => res.status(201).json(await catService.createCategory(req.body.name)));
app.patch('/categories/:id', async (req, res) => res.json(await catService.updateCategory(req.params.id, req.body.name)));
app.delete('/categories/:id', async (req, res) => res.json(await catService.deleteCategory(req.params.id)));
app.get('/categories/:id/products', async (req, res) => res.json(await catService.getProductsByCategory(req.params.id)));

// ==========================================
// 📦 2. PRODUCTS API
// ==========================================
app.get('/products', async (req, res) => res.json(await prodService.getAllProducts()));
app.get('/products/:id', async (req, res) => res.json(await prodService.getProductById(req.params.id)));
app.post('/products', async (req, res) => res.status(201).json(await prodService.createProduct(req.body)));
app.patch('/products/:id', async (req, res) => res.json(await prodService.updateProduct(req.params.id, req.body)));
app.delete('/products/:id', async (req, res) => {
    try {
        await prodService.deleteProduct(req.params.id);
        res.json({ success: true, message: "Eliminado" });
    } catch (err) { res.status(500).json({ error: "Error de integridad" }); }
});

// ==========================================
// 🧾 3. ORDERS API & POKEMON
// ==========================================
app.get('/orders', async (req, res) => res.json(await ordService.getAllOrders()));
app.post('/orders', async (req, res) => {
    try {
        const order = await ordService.createOrder(req.body.customerName, req.body.items);
        res.status(201).json({ ...order, status: "Created" });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});
app.get('/pokemon/:name', async (req, res) => res.json(await getPokemonData(req.params.name)));

// ==========================================
// 🖥️ DASHBOARD (DISEÑO CLEAN SaaS)
// ==========================================
app.get('/dashboard', async (req, res) => {
    const products = await prodService.getAllProducts();
    const categories = await catService.getAllCategories();
    
    const rows = products.map((p: any) => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
            <td class="p-4 text-slate-400 font-mono text-[10px]">#${p.id}</td>
            <td class="p-4 font-semibold text-slate-700">${p.name}</td>
            <td class="p-4 text-indigo-600 font-bold">$${parseFloat(p.price).toFixed(2)}</td>
            <td class="p-4">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} uppercase">
                    ${p.stock} en stock
                </span>
            </td>
            <td class="p-4 text-right">
                <button onclick="del(${p.id})" class="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
            </td>
        </tr>`).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="es"><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>body { font-family: 'Inter', sans-serif; }</style><title>Admin Panel</title></head>
        <body class="bg-slate-50 text-slate-600 min-h-screen p-6 md:p-12">
            <div class="max-w-6xl mx-auto">
                <header class="flex justify-between items-center mb-10">
                    <h1 class="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span class="w-3 h-3 bg-indigo-600 rounded-full"></span> TechStore Inventory
                    </h1>
                </header>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                        <h2 class="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Nuevo Producto</h2>
                        <form action="/gui-add" method="POST" class="space-y-4">
                            <input type="text" name="name" placeholder="Nombre del ítem" required class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500">
                            <div class="grid grid-cols-2 gap-4">
                                <input type="number" step="0.01" name="price" placeholder="Precio" required class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                <input type="number" name="stock" placeholder="Stock" required class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                            </div>
                            <select name="category_id" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none">
                                ${categories.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                            <button type="submit" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm">Guardar Registro</button>
                        </form>
                    </div>

                    <div class="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                    <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Producto</th>
                                    <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio</th>
                                    <th class="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th class="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <script>async function del(id) { if(confirm('¿Eliminar?')) { await fetch('/products/'+id, {method:'DELETE'}); window.location.reload(); } }</script>
        </body></html>
    `);
});

app.post('/gui-add', async (req, res) => {
    await prodService.createProduct(req.body);
    res.redirect('/dashboard');
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/dashboard`));