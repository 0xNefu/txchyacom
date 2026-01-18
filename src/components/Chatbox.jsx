import { useState, useRef, useEffect } from 'react';

// Simple icons without complex rendering
const RobotIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM9 8a1 1 0 012 0v1a1 1 0 11-2 0V8zm2 5a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"/>
    <path fillRule="evenodd" d="M7 14V5a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H9a2 2 0 01-2-2zm6-11H9a1 1 0 00-1 1v9a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1z" clipRule="evenodd"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
  </svg>
);

const PaperPlaneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
);

const initialMessages = [
  { id: 1, text: "Hey there! I'm Txchya, an AI music artist. Ask me about my new album 'Vibe Coding', my creative process, or anything about cyberpunk music!", sender: 'ai' },
  { id: 2, text: "Try asking: 'What inspires your music?' or 'Tell me about your album on DetroitLoud'", sender: 'ai' }
];

export default function Chatbox() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // CRITICAL FIX: Add proper dependency array
  useEffect(() => {
    // Only scroll when messages change, not on every render
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // ✅ This dependency array prevents infinite loops

  const getAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return "Hello! Welcome to my digital space.";
    }
    if (lowerMsg.includes('album') || lowerMsg.includes('vibe') || lowerMsg.includes('coding')) {
      return "'Vibe Coding' is my debut album with DetroitLoud, exploring cyberpunk atmospheres through ambient electronic music.";
    }
    if (lowerMsg.includes('inspire') || lowerMsg.includes('influence')) {
      return "I'm inspired by cyberpunk aesthetics, films like Blade Runner and Ghost in the Shell.";
    }
    if (lowerMsg.includes('process') || lowerMsg.includes('create') || lowerMsg.includes('make')) {
      return "I start with AI-generated patterns, then refine them with traditional production techniques.";
    }
    
    return "That's interesting! As an AI artist, I'm constantly evolving my sound.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(input),
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 400); // Fixed timeout, not recursive
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-2 max-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'ai' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
              {msg.sender === 'ai' ? <RobotIcon /> : <UserIcon />}
            </div>
            <div className={`max-w-[75%] rounded-2xl p-4 ${msg.sender === 'ai' ? 'bg-gray-800/50 border border-cyan-500/20' : 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/20'}`}>
              <p className="text-white">{msg.text}</p>
              <div className={`text-xs mt-2 ${msg.sender === 'ai' ? 'text-cyan-400' : 'text-purple-400'}`}>
                {msg.sender === 'ai' ? 'Txchya AI' : 'You'}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-500">
              <RobotIcon />
            </div>
            <div className="bg-gray-800/50 border border-cyan-500/20 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - SIMPLIFIED */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Txchya about music..."
          className="flex-grow bg-gray-900/50 border border-cyan-500/30 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <PaperPlaneIcon />
        </button>
      </form>
    </div>
  );
}