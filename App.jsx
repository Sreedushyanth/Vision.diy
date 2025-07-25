import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { 
  Moon, 
  Sun, 
  Send, 
  Eye, 
  Bot, 
  MessageSquare, 
  Dice1, 
  Settings,
  Trash2,
  Copy,
  Download,
  Sparkles,
  Zap
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"
import './App.css'

const AI_MODELS = [
  { 
    id: "openai/gpt-4o", 
    name: "GPT-4o", 
    provider: "OpenAI",
    description: "Most capable GPT-4 model",
    category: "premium"
  },
  { 
    id: "google/gemini-2.0-flash-exp:free", 
    name: "Gemini 2.0 Flash", 
    provider: "Google",
    description: "Fast and efficient multimodal model",
    category: "free"
  },
  { 
    id: "google/gemini-2.5-pro-exp-03-25", 
    name: "Gemini 2.5 Pro", 
    provider: "Google",
    description: "Advanced reasoning capabilities",
    category: "premium"
  },
  { 
    id: "mistralai/mistral-small-3.2-24b-instruct:free", 
    name: "Mistral Small", 
    provider: "Mistral",
    description: "Efficient and fast responses",
    category: "free"
  },
  { 
    id: "google/gemma-3-27b-it:free", 
    name: "Gemma 3 27B", 
    provider: "Google",
    description: "Open-source instruction-tuned model",
    category: "free"
  },
  { 
    id: "qwen/qwen2.5-vl-32b-instruct:free", 
    name: "Qwen 2.5 VL", 
    provider: "Qwen",
    description: "Vision-language model with reasoning",
    category: "free"
  },
  { 
    id: "moonshotai/kimi-vl-a3b-thinking:free", 
    name: "Kimi VL", 
    provider: "Moonshot",
    description: "Advanced thinking and vision model",
    category: "free"
  }
]

const EXAMPLE_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a Python function to sort a list of dictionaries",
  "Help me debug this JavaScript code",
  "Create a responsive CSS layout",
  "Explain the difference between React hooks",
  "Write a SQL query to find duplicate records",
  "How do I optimize my website's performance?",
  "Create a REST API endpoint in Node.js",
  "Explain machine learning concepts",
  "Help me with algorithm complexity analysis"
]

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState("light")
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const generateRandomPrompt = () => {
    const prompt = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)]
    setInput("")

    // Typing effect
    let i = 0
    const typeInterval = setInterval(() => {
      if (i < prompt.length) {
        setInput((prev) => prev + prompt.charAt(i))
        i++
      } else {
        clearInterval(typeInterval)
      }
    }, 30)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !selectedModel || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
  }

  const selectedModelInfo = AI_MODELS.find(model => model.id === selectedModel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-all duration-500">
      <div className="container mx-auto max-w-6xl p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-6 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Eye className="w-7 h-7" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      vision.diy
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Agent Chat Platform
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    disabled={messages.length === 0}
                    className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="gap-2"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === "dark" ? "Light" : "Dark"}
                  </Button>
                </div>
              </div>

              {/* Model Selection */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="h-12 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400">
                      <SelectValue placeholder="Select AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{model.name}</span>
                                <Badge 
                                  variant={model.category === "premium" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {model.category === "premium" ? <Zap className="w-3 h-3 mr-1" /> : null}
                                  {model.category}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{model.provider} • {model.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedModelInfo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg"
                  >
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                      {selectedModelInfo.name}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Chat Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="mb-6 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            <ScrollArea className="h-[500px] p-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white">
                      <MessageSquare className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome to vision.diy
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Your intelligent AI agent is ready to assist. Select a model and start your conversation!
                    </p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] group ${message.role === "user" ? "ml-12" : "mr-12"}`}>
                          <div
                            className={`rounded-2xl p-4 shadow-lg ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <ReactMarkdown
                                className="prose dark:prose-invert prose-sm max-w-none prose-p:my-2 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:p-4"
                                linkTarget="_blank"
                              >
                                {message.content}
                              </ReactMarkdown>
                            ) : (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className={`text-xs ${message.role === "user" ? "text-right" : "text-left"} text-muted-foreground`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start mr-12"
                    >
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            <div className="p-6">
              <form onSubmit={sendMessage} className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateRandomPrompt}
                    className="gap-2 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-950"
                    title="Get random prompt"
                  >
                    <Dice1 className="w-4 h-4" />
                    Random
                  </Button>
                </div>

                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="min-h-[120px] pr-14 resize-none border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400 rounded-xl text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage(e)
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute bottom-3 right-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg"
                    disabled={!input.trim() || !selectedModel || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  {selectedModel && (
                    <span className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      Using {selectedModelInfo?.name}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default App

