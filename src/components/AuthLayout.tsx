import { ShoppingBag } from 'lucide-react'
import type { ReactNode } from 'react'

export default function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <div className="brand brand-light"><span className="brand-mark"><ShoppingBag size={21} /></span> ShopEase</div>
        <div className="aside-copy">
          <span className="eyebrow">SIMPLE INVENTORY, BETTER BUSINESS</span>
          <h1>Everything your store needs, all in one place.</h1>
          <p>Keep products organized, stay on top of stock, and make every detail easier to manage.</p>
          <div className="aside-stats">
            <div><strong>Easy</strong><span>product management</span></div>
            <div><strong>Secure*</strong><span>account access</span></div>
          </div>
          <small>*Demo-only authentication; not for production use.</small>
        </div>
      </section>
      <section className="auth-main">
        <div className="auth-card">
          <div className="brand brand-mobile"><span className="brand-mark"><ShoppingBag size={21} /></span> ShopEase</div>
          <span className="eyebrow">WELCOME TO SHOPEASE</span>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
        <p className="auth-footer">© 2026 ShopEase · Practice app for Playwright automation</p>
      </section>
    </main>
  )
}