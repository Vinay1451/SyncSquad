import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chrome, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAIResponse } from "../lib/gemini";

type Message = {
  sender: "user" | "assistant";
  text: string;
};

export default function BallieAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello! I'm Ballie, your personal health assistant. How can I help you manage your diabetes today?"
    }
  ]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isWaitingForResponse) return;
    
    // Add user message
    const userMessage = { sender: "user", text: inputValue.trim() } as const;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsWaitingForResponse(true);
    
    try {
      // Get AI response
      const response = await generateAIResponse(userMessage.text);
      setMessages(prev => [...prev, { sender: "assistant", text: response }]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: "assistant", 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later." 
        }
      ]);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Chat button */}
      <Button
        onClick={handleToggleChat}
        className="w-14 h-14 rounded-full shadow-lg"
        size="icon"
      >
        <Chrome className="h-6 w-6" />
      </Button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 bg-card rounded-xl shadow-xl border overflow-hidden"
          >
            <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center">
                <Chrome className="mr-2 h-5 w-5" />
                <span className="font-medium">Ballie Health Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full">
                  Gemini
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80"
                  onClick={handleToggleChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto bg-muted/20">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Chrome className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div 
                    className={`mx-2 rounded-lg p-2 max-w-[85%] ${
                      message.sender === "assistant" 
                        ? "bg-muted" 
                        : "bg-primary/10 text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  
                  {message.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isWaitingForResponse && (
                <div className="flex mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Chrome className="h-4 w-4" />
                  </div>
                  <div className="mx-2 bg-muted rounded-lg p-3 max-w-[85%]">
                    <motion.div 
                      className="flex space-x-1"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="p-3 border-t border-border flex">
              <Input
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
                className="ml-2" 
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
