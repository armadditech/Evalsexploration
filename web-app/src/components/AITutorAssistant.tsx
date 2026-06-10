'use client';

import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { useContextStore } from '@/lib/contextStore';
import { getDomainSpecificPrompt } from '@/lib/userContext';

export default function AITutorAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Tutor. Ask me anything about building evals for your specific use case! 🤖',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { context } = useContextStore();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // In a real implementation, this would call Claude API
      // For now, we'll simulate with context-aware responses
      await new Promise(resolve => setTimeout(resolve, 1500));

      const contextInfo = getDomainSpecificPrompt(context);
      const response = generateContextAwareResponse(userMessage, context);

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center gap-2"
        >
          <FaRobot size={24} />
          <span className="font-medium pr-2">AI Tutor</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-40 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaRobot size={20} />
              <div>
                <div className="font-semibold">AI Tutor</div>
                <div className="text-xs text-white/80">Personalized Help</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your eval..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Try: "How do I test {context.systemDescription || 'my system'}?"
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Simulated context-aware responses
function generateContextAwareResponse(question: string, context: any): string {
  const q = question.toLowerCase();

  if (q.includes('test case') || q.includes('example')) {
    return `For your ${context.aiSystemType || 'AI'} system in ${context.domain}, I recommend starting with:\n\n1. Happy path cases - typical inputs your system will see\n2. Edge cases - unusual but valid inputs\n3. Error cases - invalid or malformed inputs\n\nWould you like me to generate specific examples for "${context.systemDescription}"?`;
  }

  if (q.includes('scorer') || q.includes('scoring')) {
    const type = context.aiSystemType;
    if (type === 'classification') {
      return 'For classification tasks, I recommend exactMatch scorer since you need precise category matching. Use threshold=1.0 to require perfect matches.';
    } else if (type === 'generation') {
      return 'For generation tasks, llmJudge or semanticSimilarity work best since outputs can vary. Use threshold=0.7-0.8 to allow stylistic differences.';
    }
    return 'The right scorer depends on your output format. Can you tell me more about what your system outputs?';
  }

  if (q.includes('how many')) {
    return `For ${context.experienceLevel} level:\n\n- Start with 10-20 test cases\n- Cover your main use cases first\n- Add edge cases as you find them\n- Aim for 50+ cases for production\n\nFor ${context.domain}, focus on domain-specific scenarios!`;
  }

  return `Great question about "${question}"! \n\nGiven your ${context.aiSystemType} system in ${context.domain}, here's my recommendation:\n\n1. Check the relevant tutorial sections\n2. Look at similar examples\n3. Try the Playground to test ideas\n\nNeed more specific guidance? Ask me about test cases, scorers, or implementation!`;
}
