import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { MessageSquare, Send, Building, User } from 'lucide-react';

export const StudentMessages: React.FC = () => {
  const { activeStudent, clients, messages } = useApp();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || 'client-1');
  const [inputText, setInputText] = useState('');

  if (!activeStudent) return null;

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Conversation messages with this client
  const conversation = selectedClient
    ? dataService.getConversation(activeStudent.id, selectedClient.id)
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedClient) return;

    dataService.sendMessage({
      senderId: activeStudent.id,
      senderName: activeStudent.name,
      senderRole: 'student',
      recipientId: selectedClient.id,
      recipientName: selectedClient.name,
      text: inputText.trim()
    });

    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
      {/* Left Conversations Sidebar */}
      <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Client Conversations
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Direct client communications</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {clients.map((cl) => {
            const lastMsg = messages
              .filter(
                (m) =>
                  (m.senderId === cl.id && m.recipientId === activeStudent.id) ||
                  (m.senderId === activeStudent.id && m.recipientId === cl.id)
              )
              .slice(-1)[0];

            return (
              <button
                key={cl.id}
                onClick={() => setSelectedClientId(cl.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                  selectedClientId === cl.id
                    ? 'bg-indigo-50/70 border-l-4 border-indigo-600 text-slate-900'
                    : 'hover:bg-white text-slate-700'
                }`}
              >
                <img
                  src={cl.avatar}
                  alt={cl.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover bg-slate-200 shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold truncate">{cl.company || cl.name}</span>
                    {lastMsg && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {lastMsg.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {lastMsg ? lastMsg.text : 'Click to start conversation...'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Box */}
      <div className="md:col-span-2 flex flex-col h-full bg-white">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedClient.avatar}
                  alt={selectedClient.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedClient.company || selectedClient.name}</h4>
                  <p className="text-xs text-slate-500">{selectedClient.name} &middot; {selectedClient.industry}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Online
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/40">
              {conversation.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400 italic">
                  No message history yet. Say hello and introduce your skills!
                </div>
              ) : (
                conversation.map((msg) => {
                  const isMe = msg.senderId === activeStudent.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                        <span className="font-semibold text-slate-600">{msg.senderName}</span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${selectedClient.name}...`}
                className="flex-1 text-xs rounded-lg border border-slate-200 py-2.5 px-3.5 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            Select a client from the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
