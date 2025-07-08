import { Route, Routes } from 'react-router-dom'
import LoginLayout from './LoginLayout'
import Layout from './Layout'
import './index.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginLayout />} />
        <Route path='/home' element={<Layout />} />
      </Routes>
    </>
  )
}

export default App
