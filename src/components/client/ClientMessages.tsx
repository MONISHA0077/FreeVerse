import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCheck, 
  CornerDownLeft,
  Smile,
  Clock
} from 'lucide-react';

const QUICK_PROMPTS_CLIENT = [
  '👋 Hi! Are you currently available for a new freelance task?',
  'We reviewed your portfolio and would love to discuss a project brief.',
  'Can you complete a React + Tailwind component sprint within 2 weeks?',
  'Could we schedule a quick chat to align on requirements?'
];

export const ClientMessages: React.FC = () => {
  const { activeClient, students, messages } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'stu-1');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!activeClient) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const conversation = selectedStudent
    ? dataService.getConversation(activeClient.id, selectedStudent.id)
    : [];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.length, selectedStudentId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedStudent) return;

    dataService.sendMessage({
      senderId: activeClient.id,
      senderName: activeClient.company || activeClient.name,
      senderRole: 'client',
      recipientId: selectedStudent.id,
      recipientName: selectedStudent.name,
      text: inputText.trim()
    });

    setInputText('');
    inputRef.current?.focus();
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-210px)] min-h-[480px] max-h-[660px]">
      {/* Left Student List */}
      <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50 min-h-0">
        <div className="p-3.5 border-b border-slate-200 bg-white shrink-0">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Student Chats
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Select a student to message</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {students.map((stu) => {
            const lastMsg = messages
              .filter(
                (m) =>
                  (m.senderId === stu.id && m.recipientId === activeClient.id) ||
                  (m.senderId === activeClient.id && m.recipientId === stu.id)
              )
              .slice(-1)[0];

            const isSelected = selectedStudentId === stu.id;

            return (
              <button
                key={stu.id}
                onClick={() => {
                  setSelectedStudentId(stu.id);
                  inputRef.current?.focus();
                }}
                className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${
                  isSelected
                    ? 'bg-indigo-50/80 border-l-4 border-indigo-600 text-slate-900'
                    : 'hover:bg-white text-slate-700'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover bg-slate-200 border border-slate-200"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      stu.availability === 'Available' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold truncate">{stu.name}</span>
                    {lastMsg && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {lastMsg.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {lastMsg ? lastMsg.text : `${stu.role} · ${stu.studentId}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Pane */}
      <div className="md:col-span-2 flex flex-col h-full bg-white min-h-0">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 bg-white"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedStudent.role} &middot; <span className="font-mono font-semibold">{selectedStudent.studentId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                  {selectedStudent.availability}
                </span>
              </div>
            </div>

            {/* Chat Messages Scroll Container */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-slate-50/50">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto py-6 space-y-4">
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-2xs">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Start conversation with {selectedStudent.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Send a message below to discuss task requirements, deadlines, or invite them to a project brief.
                    </p>
                  </div>

                  {/* 1-Click Quick Starter Suggestions */}
                  <div className="w-full space-y-2 pt-2 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                      Quick Starters (Click to use)
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {QUICK_PROMPTS_CLIENT.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleQuickPrompt(prompt)}
                          className="w-full text-left text-xs p-2.5 rounded-lg bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-colors shadow-2xs group flex items-center justify-between"
                        >
                          <span className="truncate mr-2">{prompt}</span>
                          <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {conversation.map((msg) => {
                    const isMe = msg.senderId === activeClient.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-600">{msg.senderName}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {msg.timestamp}
                          </span>
                        </div>
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Prominent, Fixed Bottom Input Area */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSend} className="space-y-2">
                <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 focus-within:border-indigo-600 focus-within:bg-white rounded-xl p-1.5 transition-all shadow-2xs">
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Type your message to ${selectedStudent.name} here...`}
                    className="flex-1 text-xs px-2.5 py-1.5 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                      inputText.trim()
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs scale-100'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="w-3 h-3 text-slate-400" />
                    Press <strong>Enter</strong> to send
                  </span>
                  <span>Messages saved locally &middot; instant delivery</span>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            Select a student from the sidebar to chat.
          </div>
        )}
      </div>
    </div>
  );
};
