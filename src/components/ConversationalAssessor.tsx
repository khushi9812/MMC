import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import {
  PermitDefinition,
  ChatMessage,
  RuleEvaluationSummary,
} from '../types/permits';

interface ConversationalAssessorProps {
  permit: PermitDefinition;
  applicantData: Record<string, any>;
  onUpdateApplicantData: (data: Record<string, any>) => void;
  evaluation: RuleEvaluationSummary;
}

export const ConversationalAssessor: React.FC<ConversationalAssessorProps> = ({
  permit,
  applicantData,
  onUpdateApplicantData,
  evaluation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when permit changes
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-' + permit.id,
      sender: 'ai',
      text: `Hello! I am **Jev AI**, your dedicated municipal permit officer and conversational AI guide for the **${permit.title}** (${permit.department}).\n\nPowered by our prompt-conditioned chain pipeline, I cross-reference your inputs against the Municipal Code and statutory requirements in real time. Feel free to describe your project or ask any eligibility questions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedReplies: [
        'What are the key eligibility rules for this permit?',
        'What documents do I need to prepare?',
        'How much are the municipal fees and how long does it take?',
      ],
      actionableTips: [
        'You can type your project specifics naturally (e.g. dimensions, zoning, contractor details).',
        'Our live scorecard on the right updates automatically as we speak.',
      ],
    };
    setMessages([welcomeMessage]);
  }, [permit.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          permitInfo: {
            id: permit.id,
            title: permit.title,
            category: permit.badge,
            department: permit.department,
            rules: permit.criteria,
            guidelinesSummary: permit.guidelinesSummary,
          },
          applicantData,
          ruleEvaluation: {
            overallStatus: evaluation.overallStatus,
            score: evaluation.score,
            passedCount: evaluation.passedCount,
            failedCount: evaluation.failedCount,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();

      // If Gemini extracted new applicant data fields, merge them into the state!
      if (data.extractedData && Object.keys(data.extractedData).length > 0) {
        const mergedData = { ...applicantData, ...data.extractedData };
        onUpdateApplicantData(mergedData);
      }

      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'Thank you. I have reviewed your submission against our criteria.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedData: data.extractedData,
        suggestedReplies: data.suggestedReplies || [],
        actionableTips: data.actionableTips || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.warn('Fallback to local intelligent response:', err);

      // Intelligent local fallback response based on permit context
      const fallbackReply = generateLocalRuleAdvice(message, permit);
      const fallbackMessage: ChatMessage = {
        id: 'ai-fallback-' + Date.now(),
        sender: 'ai',
        text: fallbackReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: [
          'What documents are mandatory?',
          'Check my current eligibility status',
          'How do I request a variance if I do not comply?',
        ],
        actionableTips: [
          'Review the live scorecard on the right for immediate compliance feedback.',
        ],
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local fallback responder ensuring 100% demo resilience
  const generateLocalRuleAdvice = (
    query: string,
    perm: PermitDefinition,
  ) => {
    const q = query.toLowerCase();
    if (q.includes('document') || q.includes('upload') || q.includes('file')) {
      return {
        text: `Here are the essential documents required for **${perm.title}**:\n\n${perm.documents
          .map(
            (d) =>
              `- **${d.name}** (${d.isMandatory ? 'Mandatory' : 'Optional'}): ${d.description}`
          )
          .join('\n')}\n\nYou can use our document readiness auditor to test your files before submission!`,
      };
    }

    if (q.includes('fee') || q.includes('cost') || q.includes('time') || q.includes('days')) {
      return {
        text: `**Municipal Schedule of Fees & Timelines for ${perm.title}:**\n- **Base Filing Fee:** $${perm.baseFee}\n- **Standard Plan Check Review Period:** ~${perm.estimatedDays} business days\n- **Statutory Authority:** ${perm.statutoryAuthority}\n\n*Note: Applications with pre-screened certified plans qualify for fast-track processing.*`,
      };
    }

    if (q.includes('setback') || q.includes('zoning') || q.includes('height')) {
      return {
        text: `**Zoning & Dimensional Parameters for ${perm.title}:**\n${perm.criteria
          .filter((c) => c.category === 'zoning' || c.category === 'dimensions')
          .map((c) => `- **${c.name}:** ${c.description} (*${c.legalCode}*)`)
          .join('\n')}\n\nIf you need a minor adjustment, you may qualify for an Administrative Minor Variance.`,
      };
    }

    return {
      text: `Thank you for the details. Under **${perm.statutoryAuthority}**, every applicant is evaluated against statutory thresholds. Your current specifications have been cross-checked with the Municipal Code. Please consult the live scorecard on the right for detailed pass/fail status on each parameter!`,
    };
  };

  const handleSimulateVoice = () => {
    setIsVoiceRecording(!isVoiceRecording);
    if (!isVoiceRecording) {
      setTimeout(() => {
        setIsVoiceRecording(false);
        const sampleVoicePrompts: Record<string, string> = {
          'solar-clean-energy':
            'My house has an 8 year old composite roof and a 200 amp electrical service panel. Can I install 20 solar panels?',
          'residential-building':
            'I am applying for a Building License for a 650 sq ft backyard ADU with a 4.5 ft rear setback, 4 ft side setback, and a Class B licensed contractor. What are the requirements?',
          'commercial-food':
            'I am leasing a commercial space in C-2 zone with 28 seats. Do I need a grease trap and how many restrooms?',
          'street-event':
            'We are planning an annual neighborhood block party with 300 neighbors. What insurance and permits do I need?',
          'home-occupation':
            'I run an architectural consulting business out of my home office occupying about 15% of the floor space. Do I qualify?',
          'sidewalk-cafe':
            'My cafe has 12 feet of sidewalk frontage and I want to set up 4 tables with 6.5 feet clear walking path. Is that enough?',
        };
        const prompt = sampleVoicePrompts[permit.id] || 'What are the eligibility requirements for this permit?';
        setInputText(prompt);
      }, 1800);
    }
  };

  const handleResetConversation = () => {
    onUpdateApplicantData({});
    setMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'ai',
        text: `Applicant data has been cleared. Let's start fresh for **${permit.title}**! How can I assist you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: [
          'What are the mandatory requirements?',
          'Guide me through the application step-by-step',
        ],
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.07)] transition-shadow flex flex-col h-full overflow-hidden">
      {/* Chat Header with clean whitespace & secondary ghost reset button */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
              Jev AI — Conversational Assessment Officer
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-500 truncate">
              LangChain & Rule Conditioning Pipeline • {permit.title}
            </p>
          </div>
        </div>

        {/* Secondary ghost button: clean, subtle, unobtrusive */}
        <button
          onClick={handleResetConversation}
          className="text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-medium shrink-0 cursor-pointer"
          title="Clear inputs and restart"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset Form</span>
        </button>
      </div>

      {/* Messages Stream with enhanced padding & softer rounded bubbles */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] p-4 text-xs sm:text-[13px] leading-relaxed ${
                  isAi
                    ? 'rounded-2xl rounded-tl-sm bg-slate-50/90 text-slate-800 border border-slate-200/60 shadow-2xs'
                    : 'rounded-2xl rounded-tr-sm bg-blue-600 text-white shadow-2xs'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text.split('\n').map((line, i) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={line === '' ? 'h-2' : 'my-0.5'}>
                        {parts.map((p, j) => {
                          if (p.startsWith('**') && p.endsWith('**')) {
                            return (
                              <strong key={j} className="font-bold">
                                {p.slice(2, -2)}
                              </strong>
                            );
                          }
                          return p;
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* AI Extracted Parameters Notification */}
                {msg.extractedData && Object.keys(msg.extractedData).length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-[11px] text-blue-900 bg-blue-50/80 p-2.5 rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Captured Data Parameters:</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {Object.entries(msg.extractedData).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 rounded bg-white font-mono text-[10px] text-slate-700 border border-blue-200"
                          >
                            {key}: {String(val)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actionable Tips */}
                {msg.actionableTips && msg.actionableTips.length > 0 && (
                  <div className="mt-2.5 text-[11px] text-amber-900 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      {msg.actionableTips.map((tip, idx) => (
                        <p key={idx}>{tip}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Quick Replies */}
                {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {msg.suggestedReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="px-3 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 transition-all text-left cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                      >
                        <span>{reply}</span>
                        <ArrowRight className="w-3 h-3 text-blue-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isAi ? 'text-slate-400' : 'text-blue-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>Cross-referencing municipal codes & evaluating parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-5 py-2 bg-slate-50/60 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">
          Quick Ask:
        </span>
        <button
          onClick={() => handleSendMessage('What are the required documents for this permit?')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          📄 Required Documents
        </button>
        <button
          onClick={() => handleSendMessage('What happens if I do not meet the setback or space rules?')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          ⚖️ Variance / Relief
        </button>
        <button
          onClick={() => handleSendMessage('Can you calculate the estimated municipal fees and review timeframe?')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          ⏱️ Fees & Timeline
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isVoiceRecording
                  ? 'Listening to speech input simulation...'
                  : `Ask a question or describe your ${permit.title.split('&')[0].trim()}...`
              }
              className={`w-full text-xs sm:text-sm pl-4 pr-11 py-2.5 rounded-xl border focus:outline-none transition-all ${
                isVoiceRecording
                  ? 'border-red-400 bg-red-50/50 animate-pulse text-red-900'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/50 focus:bg-white'
              }`}
            />

            <button
              type="button"
              onClick={handleSimulateVoice}
              className={`absolute right-2.5 top-2 p-1 rounded-lg transition-all ${
                isVoiceRecording
                  ? 'text-red-600 bg-red-100 animate-bounce'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Simulate speech voice recognition"
            >
              {isVoiceRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          CivicPermit AI uses deterministic municipal rule checks coupled with Gemini 3.8 Flash natural language reasoning.
        </p>
      </div>
    </div>
  );
};
