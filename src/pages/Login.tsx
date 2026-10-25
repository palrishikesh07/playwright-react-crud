import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const result = login(email, password)
    if (!result.ok) { setError(result.message); return }
    navigate('/products')
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your product workspace.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="login-password">Password</label>
        <div className="password-wrap">
          <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="icon-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="primary-button full-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
      </form>
      <p className="auth-switch">New to ShopEase? <Link to="/register">Create an account</Link></p>
      <div className="demo-note"><strong>Testing tip</strong><span>Register a new account first. Your demo account is saved in this browser.</span></div>
    </AuthLayout>
  )
}