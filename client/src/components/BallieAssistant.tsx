import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, User, X, Maximize2, Minimize2, 
  Heart, Activity, Brain, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAIResponse } from "../lib/gemini";
import { useTheme } from "@/context/ThemeContext";

type Message = {
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
};

export default function BallieAssistant() {
  const themeContext = { theme: 'light' };
  try {
    // Try to use the theme context, but fall back to a default if it fails
    Object.assign(themeContext, useTheme());
  } catch (e) {
    console.warn('Theme context not available, using default theme');
  }
  const { theme } = themeContext;
  
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello! I'm Ballie, your personal health assistant powered by Gemini AI. How can I help you manage your diabetes today?",
      timestamp: new Date()
    }
  ]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input field when chat is opened
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isWaitingForResponse) return;
    
    // Add user message
    const userMessage: Message = { sender: "user", text: inputValue.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsWaitingForResponse(true);
    
    try {
      // Get AI response
      const response = await generateAIResponse(userMessage.text);
      setMessages(prev => [...prev, { 
        sender: "assistant" as const, 
        text: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: "assistant" as const, 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Suggestions for the user to try
  const suggestions = [
    "How can I manage high blood sugar?",
    "What foods should I eat to maintain stable glucose?",
    "How does exercise affect my blood sugar?",
    "What are normal blood sugar ranges for diabetics?",
    "What are the symptoms of hypoglycemia?",
    "What medications are effective for type 2 diabetes?",
    "What are the risk factors for developing diabetes?",
    "How can I prevent long-term complications?",
    "What should I do if my glucose is too low?",
    "Tips for taking medications consistently",
    "What is the recommended exercise for diabetics?",
    "How do stress and sleep affect my glucose levels?",
    "What do my weekly glucose trends indicate?",
    "How do my monthly glucose patterns look?",
    "Why does my blood sugar spike on Wednesdays?",
    "What explains the high glucose reading in Week 3?",
    "How can I stabilize my weekly glucose patterns?"
  ];

  // Function to use a suggestion
  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Chat button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleToggleChat}
          className="w-14 h-14 rounded-full shadow-lg"
          size="icon"
        >
          {isWaitingForResponse ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.1, 0.9, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1]
              }}
            >
              <Bot className="h-6 w-6" />
            </motion.div>
          )}
        </Button>
      </motion.div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${isExpanded ? 'bottom-20 right-0 w-[400px] sm:w-[450px] md:w-[500px]' : 'bottom-16 right-0 w-80 sm:w-96'} bg-card rounded-xl shadow-xl border overflow-hidden`}
          >
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-medium">Ballie Health Assistant</span>
                  <div className="text-xs opacity-80">Diabetes Management AI</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span>Gemini AI</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-primary-foreground hover:text-primary-foreground/80"
                  onClick={handleToggleExpand}
                  title={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-primary-foreground hover:text-primary-foreground/80"
                  onClick={handleToggleChat}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages area */}
            <div 
              className={`p-4 ${isExpanded ? 'h-[400px]' : 'h-80'} overflow-y-auto bg-muted/20 backdrop-blur-sm`}
              style={{
                backgroundImage: theme === 'dark'
                  ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 100%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 100%)'
              }}
            >
              {/* Suggestions at the start */}
              {messages.length === 1 && (
                <div className="mb-5">
                  <div className="text-sm text-muted-foreground mb-2">Try asking:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, isExpanded ? 6 : 3).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs py-1 h-auto"
                        onClick={() => useSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            
              {/* Message bubbles */}
              {messages.map((message, index) => (
                <motion.div 
                  key={index} 
                  className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.sender === "assistant" && (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  
                  <div className="mx-2 max-w-[85%] flex flex-col">
                    <div 
                      className={`rounded-2xl p-3 ${
                        message.sender === "assistant" 
                          ? "bg-card border border-border shadow-sm" 
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.sender === "assistant" && (
                        <div className="flex space-x-1 mb-1">
                          {index > 0 && (
                            <div className="text-[10px] text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm whitespace-pre-line">
                        {message.text}
                      </p>
                    </div>
                    
                    {message.sender === "user" && (
                      <div className="text-[10px] text-muted-foreground self-end mr-3 mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    )}
                  </div>
                  
                  {message.sender === "user" && (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Waiting for response indicator */}
              {isWaitingForResponse && (
                <motion.div 
                  className="flex mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="mx-2 bg-card border border-border shadow-sm rounded-2xl p-3 max-w-[85%]">
                    <motion.div 
                      className="flex items-center space-x-1.5"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        duration: 0.7 
                      }}
                    >
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick action buttons - only in expanded mode */}
            {isExpanded && (
              <div className="p-2 border-t border-border bg-card/60 backdrop-blur-sm flex justify-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => useSuggestion("What are normal blood sugar ranges for diabetics?")}
                >
                  <Heart className="h-3 w-3 mr-1 text-red-500" /> Normal Ranges
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => useSuggestion("What is the recommended exercise for diabetics?")}
                >
                  <Activity className="h-3 w-3 mr-1 text-blue-500" /> Exercise
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => useSuggestion("What medications are effective for type 2 diabetes?")}
                >
                  <Brain className="h-3 w-3 mr-1 text-purple-500" /> Medications
                </Button>
              </div>
            )}
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border flex bg-background">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask Ballie about your health..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isWaitingForResponse}
              />
              <Button 
                type="submit" 
                size="icon"
                className="ml-2 rounded-full" 
                disabled={!inputValue.trim() || isWaitingForResponse}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
