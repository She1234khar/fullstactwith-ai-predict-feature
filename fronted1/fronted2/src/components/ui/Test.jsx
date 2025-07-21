// src/components/ui/TestComponent.jsx

import React, { useState } from "react";
import { getRecommendations, askChatbot, getDiscountCategories } from "../../api/ai";

export default function Test() {
  // Recommendation state
  const [recInput, setRecInput] = useState("");
  const [recResult, setRecResult] = useState("");

  // Chatbot state
  const [chatInput, setChatInput] = useState("");
  const [chatResult, setChatResult] = useState("");

  // Discount state
  const [discountResult, setDiscountResult] = useState("");

  // Handlers
  const handleRecommend = async () => {
    setRecResult("Loading...");
    const res = await getRecommendations({ interest: recInput });
    setRecResult(res.recommendations || JSON.stringify(res));
  };

  const handleChat = async () => {
    setChatResult("Loading...");
    const res = await askChatbot(chatInput);
    setChatResult(res.answer || JSON.stringify(res));
  };

  const handleDiscounts = async () => {
    setDiscountResult("Loading...");
    const res = await getDiscountCategories();
    setDiscountResult(res.summary || JSON.stringify(res));
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>AI Features Playground</h2>

      {/* Recommendations */}
      <section style={{ marginBottom: 32 }}>
        <h3>Product Recommendations</h3>
        <input
          type="text"
          placeholder="Enter your interest (e.g. shoes, men, sports)"
          value={recInput}
          onChange={e => setRecInput(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
        <button onClick={handleRecommend}>Get Recommendations</button>
        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{recResult}</div>
      </section>

      {/* Chatbot */}
      <section style={{ marginBottom: 32 }}>
        <h3>AI Chatbot</h3>
        <input
          type="text"
          placeholder="Ask anything (order, return, product, etc.)"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
        <button onClick={handleChat}>Ask</button>
        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{chatResult}</div>
      </section>

      {/* Discount Categories */}
      <section>
        <h3>Discount Categories</h3>
        <button onClick={handleDiscounts}>Show Discounted Categories</button>
        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{discountResult}</div>
      </section>
    </div>
  );
}
