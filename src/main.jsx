import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'
import ChatPage from './Components/ChatPage.jsx'
import { ChatProvider } from './Context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <Toaster position='top-center'/>
      <ChatProvider>
      <Routes>
        <Route path='/' element={ <App />} />
        <Route path='/chat'element={<ChatPage/>}/>
        
      </Routes>
      </ChatProvider>
    </BrowserRouter>
  
)
