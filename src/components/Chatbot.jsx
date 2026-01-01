import React, { useState, useRef, useEffect } from 'react';
import { useTransaction } from '../context/TransactionContext';
import { MessageSquare, X, Send } from 'lucide-react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { transactions, loading, error } = useTransaction();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // Simulate AI response based on transaction data
    const botResponse = await getBotResponse(input, transactions);
    setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
  };

  const getBotResponse = async (query, transactionsData) => {
    const lowerQuery = query.toLowerCase();

    if (loading) return "I'm still loading your transaction data. Please wait a moment.";
    if (error) return "I'm having trouble accessing your transaction data. Please check your connection.";
    if (transactionsData.length === 0) return "You don't have any transactions yet. Add some to get insights!";

    // Basic analysis functions
    const getTotalIncome = () => transactionsData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const getHighestIncome = () => Math.max(...transactionsData.filter(t => t.type === 'income').map(t => Number(t.amount)));
    const getLowestIncome = () => Math.min(...transactionsData.filter(t => t.type === 'income').map(t => Number(t.amount)));
    const getAverageIncome = () => {
      const incomes = transactionsData.filter(t => t.type === 'income');
      return incomes.length ? getTotalIncome() / incomes.length : 0;
    };
    const getIncomeByCategory = () => {
      const categoryMap = {};
      transactionsData.forEach(t => {
        const amount = Number(t.amount);
        if (!isNaN(amount) && t.type === 'income') {
          const category = t.category || "Other";
          categoryMap[category] = (categoryMap[category] || 0) + amount;
        }
      });
      return Object.entries(categoryMap).map(([category, income]) => `${category}: ₹${income.toFixed(2)}`).join(', ');
    };

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hello! How can I help you with your financial data today?";
    } else if (lowerQuery.includes('total income')) {
      return `Your total recorded income is ₹${getTotalIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('highest income')) {
      return `Your highest single income amount is ₹${getHighestIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('lowest income')) {
      return `Your lowest single income amount is ₹${getLowestIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('average income')) {
      return `Your average income per transaction is ₹${getAverageIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('income by category')) {
      const categories = getIncomeByCategory();
      return `Here's your income by category: ${categories}.`;
    } else if (lowerQuery.includes('thank you') || lowerQuery.includes('thanks')) {
      return "You're welcome! Let me know if you have more questions.";
    } else {
      return "I can help with: total income, highest/lowest/average income, or income by category. Just ask!";
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[500px] glass-card rounded-2xl flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-4 bg-primary/10 border-b border-border/50 flex justify-between items-center rounded-t-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-full text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask about your finances</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-10">
                <p>👋 Hi! Im your personal finance assistant.</p>
                <p className="mt-2">Try asking: "What is my total income?"</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] p-3 rounded-2xl text-sm font-medium
                  ${msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none shadow-lg shadow-primary/20'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border/50 bg-secondary/30 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-xl bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 p-4 rounded-full shadow-2xl transition-all z-50 hover:scale-110 active:scale-95 ${isOpen ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground shadow-primary/30'
          }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </>
  );
}