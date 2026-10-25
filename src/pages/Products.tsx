import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Boxes, LayoutDashboard, LogOut, PackagePlus, Pencil, Plus, Search, ShoppingBag, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { seedProducts } from '../data/products'
import type { Product, ProductInput } from '../types'

const STORAGE_KEY = 'shopease_products'
const blankProduct: ProductInput = { name: '', category: 'Electronics', price: 0, stock: 0, description: '' }

function readProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as Product[]
  } catch { /* Use the seed data when saved data is invalid. */ }
  return seedProducts
}

function money(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

export default function Products() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>(readProducts)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductInput>(blankProduct)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)) }, [products])

  const filteredProducts = useMemo(() => products.filter((product) =>
    `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.toLowerCase())
  ), [products, search])

  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStock = products.filter((product) => product.stock < 10).length

  function openCreate() {
    setEditingId(null); setForm(blankProduct); setError(''); setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditingId(product.id)
    setForm({ name: product.name, category: product.category, price: product.price, stock: product.stock, description: product.description })
    setError(''); setModalOpen(true)
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (form.name.trim().length < 2) { setError('Product name must be at least 2 characters.'); return }
    if (form.price <= 0) { setError('Price must be greater than 0.'); return }
    if (form.stock < 0 || !Number.isInteger(Number(form.stock))) { setError('Stock must be a whole number of 0 or more.'); return }
    if (editingId) {
      setProducts((current) => current.map((item) => item.id === editingId ? { ...form, name: form.name.trim(), id: editingId } : item))
      setNotice('Product updated successfully.')
    } else {
      const product: Product = { ...form, name: form.name.trim(), id: `prd-${Date.now()}` }
      setProducts((current) => [product, ...current])
      setNotice('Product created successfully.')
    }
    setModalOpen(false)
  }

  function deleteProduct(product: Product) {
    if (window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      setProducts((current) => current.filter((item) => item.id !== product.id))
      setNotice(`"${product.name}" was deleted.`)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/products" className="brand"><span className="brand-mark"><ShoppingBag size={21} /></span> ShopEase</Link>
        <div className="sidebar-label">WORKSPACE</div>
        <nav><Link className="nav-link active" to="/products"><LayoutDashboard size={18} /> Products</Link></nav>
        <div className="sidebar-bottom">
          <div className="user-avatar">{user?.name.charAt(0).toUpperCase() || 'U'}</div>
          <div className="user-meta"><strong>{user?.name}</strong><span>{user?.email}</span></div>
          <button className="logout-button" type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><span className="breadcrumb">Workspace</span><span className="breadcrumb-separator">/</span><strong>Products</strong></div><div className="topbar-user"><span className="status-dot" /> Demo workspace</div></header>
        <section className="page-content">
          <div className="page-heading">
            <div><span className="eyebrow">INVENTORY OVERVIEW</span><h1>Products</h1><p className="muted">Manage your catalog, pricing, and stock in one place.</p></div>
            <button className="primary-button" type="button" onClick={openCreate}><Plus size={18} /> Add product</button>
          </div>

          {notice && <div className="success-banner" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></button></div>}

          <section className="stats-grid" aria-label="Product statistics">
            <article className="stat-card"><div className="stat-icon purple"><Boxes size={20} /></div><span>Total products</span><strong>{products.length}</strong><small>Products in your catalog</small></article>
            <article className="stat-card"><div className="stat-icon blue"><PackagePlus size={20} /></div><span>Units in stock</span><strong>{products.reduce((sum, product) => sum + product.stock, 0)}</strong><small>Across all products</small></article>
            <article className="stat-card"><div className="stat-icon amber"><ShoppingBag size={20} /></div><span>Low stock</span><strong>{lowStock}</strong><small>Products with fewer than 10 units</small></article>
            <article className="stat-card"><div className="stat-icon green"><span className="currency-icon">₹</span></div><span>Inventory value</span><strong>{money(totalValue)}</strong><small>Price × available stock</small></article>
          </section>

          <section className="table-panel">
            <div className="table-heading"><div><h2>Product catalog</h2><p className="muted">View and manage all your products.</p></div><label className="search-box"><Search size={17} /><input aria-label="Search products" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
            <div className="table-scroll"><table>
              <thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th className="actions-heading">ACTIONS</th></tr></thead>
              <tbody>
                {filteredProducts.map((product) => <tr key={product.id}>
                  <td><div className="product-cell"><div className="product-symbol"><ShoppingBag size={19} /></div><div><strong>{product.name}</strong><span>{product.description}</span></div></div></td>
                  <td><span className="category-pill">{product.category}</span></td>
                  <td className="price-cell">{money(product.price)}</td>
                  <td>{product.stock} units</td>
                  <td><span className={`stock-pill ${product.stock < 10 ? 'stock-low' : 'stock-good'}`}><span />{product.stock < 10 ? 'Low stock' : 'In stock'}</span></td>
                  <td><div className="row-actions"><button type="button" aria-label={`Edit ${product.name}`} title="Edit product" onClick={() => openEdit(product)}><Pencil size={16} /></button><button type="button" className="delete-action" aria-label={`Delete ${product.name}`} title="Delete product" onClick={() => deleteProduct(product)}><Trash2 size={16} /></button></div></td>
                </tr>)}
                {filteredProducts.length === 0 && <tr><td colSpan={6}><div className="empty-state"><Search size={24} /><strong>No products found</strong><span>Try another search or add a new product.</span></div></td></tr>}
              </tbody>
            </table></div>
            <div className="table-footer"><span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span><span>Changes are saved in this browser</span></div>
          </section>
          <p className="page-footnote">ShopEase demo · Data is stored locally in your browser for automation practice.</p>
        </section>
      </main>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false) }}>
        <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <div className="modal-heading"><div><span className="eyebrow">{editingId ? 'UPDATE CATALOG' : 'NEW CATALOG ITEM'}</span><h2 id="product-modal-title">{editingId ? 'Edit product' : 'Add product'}</h2><p className="muted">Enter the product details below.</p></div><button className="icon-button modal-close" type="button" aria-label="Close dialog" onClick={() => setModalOpen(false)}><X size={20} /></button></div>
          <form onSubmit={saveProduct} className="product-form">
            <label htmlFor="product-name">Product name</label><input id="product-name" name="productName" placeholder="e.g. Wireless Mouse" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label htmlFor="product-description">Description</label><textarea id="product-description" name="description" placeholder="Briefly describe the product" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="form-two-columns"><div><label htmlFor="product-category">Category</label><select id="product-category" name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Electronics</option><option>Accessories</option><option>Home</option><option>Office</option><option>Clothing</option><option>Other</option></select></div><div><label htmlFor="product-price">Price (₹)</label><input id="product-price" name="price" type="number" min="0.01" step="0.01" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required /></div></div>
            <label htmlFor="product-stock">Stock quantity</label><input id="product-stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
            {error && <p role="alert" className="form-error">{error}</p>}
            <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Create product'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  )
}