export interface User {
  name: string
  email: string
  password: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
}

export type ProductInput = Omit<Product, 'id'>