import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import './index.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
<Route path='/' element={<Dashboard />} />
<Route path='/code/:code' element={<Stats />} />
</Routes>
</BrowserRouter>
</React.StrictMode>
)