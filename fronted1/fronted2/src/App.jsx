import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/auth/Layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashBoard from "./pages/admin-view/dashboard";
import AdminFeature from "./pages/admin-view/features";
import AdminOrders from "./pages/admin-view/orders";
import AdminProducts from "./pages/admin-view/products";
import ShoppingLayout from "./components/shopping-view/layout";
import Tr from "./pages/not-found/tr";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingListin from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import Unauth from "./pages/unauth-page/unauth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuthStatus } from "./store/auth-slice/slice";
import PaypalReturn from "./pages/shopping-view/paypal-return";
import PaypalCancel from "./pages/shopping-view/paypal-cancel";
import PaymentSuccess from "./pages/shopping-view/payment-success";
import SearchPage from "./pages/shopping-view/search";
import React, { useState } from 'react';
import { askChatbot } from './api/ai';
//import { Skeleton } from "@/components/ui/skeleton"

function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = React.useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setLoading(true);
    setInput('');
    const res = await askChatbot(input);
    setMessages(msgs => [...msgs, { from: 'ai', text: res.answer || 'No answer.' }]);
    setLoading(false);
  };

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: '#2563eb',
          color: 'white',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: 28,
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Open AI Chatbot"
      >
        💬
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 340,
            maxHeight: 480,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 600, background: '#2563eb', color: 'white' }}>
            AI Chatbot
            <button onClick={() => setOpen(false)} style={{ float: 'right', background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
          <div ref={chatRef} style={{ flex: 1, padding: 12, overflowY: 'auto', background: '#f9fafb', transition: 'background 0.2s' }}>
            {messages.length === 0 && <div style={{ color: '#888' }}>Ask me anything about products, orders, returns, etc.</div>}
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end' }}>
                {msg.from === 'ai' && (
                  <span style={{ marginRight: 6, fontSize: 20, display: 'flex', alignItems: 'center' }}>🤖</span>
                )}
                <span
                  style={{
                    display: 'inline-block',
                    background: msg.from === 'user' ? '#2563eb' : '#e5e7eb',
                    color: msg.from === 'user' ? 'white' : '#222',
                    borderRadius: 18,
                    padding: '8px 16px',
                    maxWidth: 220,
                    wordBreak: 'break-word',
                    fontSize: 15,
                    boxShadow: msg.from === 'user' ? '0 2px 8px #2563eb22' : '0 2px 8px #8882',
                    transition: 'background 0.2s',
                  }}
                >
                  {msg.text}
                </span>
                {msg.from === 'user' && (
                  <span style={{ marginLeft: 6, fontSize: 20, display: 'flex', alignItems: 'center' }}>🧑</span>
                )}
              </div>
            ))}
            {loading && <div style={{ color: '#2563eb', marginLeft: 4 }}>AI is typing<span className="animate-pulse">...</span></div>}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8, background: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Type your message..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, padding: 8, borderRadius: 6 }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ marginLeft: 8, background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {

  // const isAuthenticated=true;
  // const user={
  //   name:"shekhar",
  //   role:"user",
  // };

  // const isAuthenticated=false;
  // const user=null;
  const {user,isAuthenticated,isLoading}=useSelector(state=>state.auth)

 const dispatch=useDispatch();

 useEffect(()=>{
   dispatch(checkAuthStatus());
 },[dispatch])

if(isLoading) return <div>Loading...</div>


  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      
      <Routes>
        {/* Default route - redirect to appropriate page based on auth status */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/shop/home" replace /> : <Navigate to="/auth/login" replace />
        } />

        <Route path="/auth" element={<Layout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
          </CheckAuth>}>
          <Route path="dashboard" element={<AdminDashBoard/>} />
          <Route path="feature" element={<AdminFeature/>} />
          <Route path="orders" element={<AdminOrders/>} />
          <Route path="product" element={<AdminProducts/>} />
        </Route>
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="listing" element={<ShoppingListin />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturn/>}/>
          <Route path="paypal-cancel" element={<PaypalCancel/>}/>
          <Route path="payment-success" element={<PaymentSuccess/>}/>
          <Route path="search" element={<SearchPage/>}/>
        </Route>

        <Route path="/unauth" element={<Unauth/>}></Route>
        <Route path="*" element={<Tr/>}/>
      </Routes>
      <FloatingChatbot />
    </div>
  );
}

export default App;
