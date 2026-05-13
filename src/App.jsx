import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import AdminPage from './pages/AdminPage'

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
          <Route path="/:category" element={<StoreLayout><CategoryPage /></StoreLayout>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
