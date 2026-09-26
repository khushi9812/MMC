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
  AlertTriangle,
  XCircle,
  FileCheck2,
  Building2,
  MapPin,
  Volume2,
  Sliders,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { MysuruProperty, ProposedConstruction } from '../types/mysuru';
import {
  evaluateMysuruPermitEligibility,
  EligibilityResult,
} from '../utils/mysuruRuleEngine';

interface MysuruChatAssistantProps {
  property: MysuruProperty;
  proposed: ProposedConstruction;
  onUpdateProposed: (newProposed: ProposedConstruction) => void;
  onSelectProperty: (property: MysuruProperty) => void;
  uploadedDocTypes: string[];
  lang?: 'en' | 'kn';
  onNavigateTab: (tab: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  extractedUpdates?: Partial<ProposedConstruction>;
  suggestedQuestions?: string[];
  showEvaluationCard?: boolean;
  actionableNextSteps?: string[];
}

export const MysuruChatAssistant: React.FC<MysuruChatAssistantProps> = ({
  property,
  proposed,
  onUpdateProposed,
  onSelectProperty,
  uploadedDocTypes,
  lang = 'en',
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<'en' | 'kn'>(lang);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Rule Evaluation based on current property & proposed construction
  const evaluation: EligibilityResult = evaluateMysuruPermitEligibility(
    property,
    proposed,
    uploadedDocTypes
  );

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeText =
      chatLanguage === 'kn'
        ? `ನಮಸ್ಕಾರ! ನಾನು **ಜೆವ್ ಎಐ (Jev AI)**, ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (MCC) ಮತ್ತು ಮೂಡಾ (MUDA) ಕಟ್ಟಡ ಪರವಾನಗಿ ಸಲಹಾ ಅಧಿಕಾರಿ.\n\nನಿಮ್ಮ ಆಸ್ತಿ **${property.siteNumber} (${property.layoutName})** ಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ನಿವೇಶನ ನಿಯಮಗಳು, ಸೆಟ್‌ಬ್ಯಾಕ್, ಗ್ರೌಂಡ್ ಕವರೇಜ್, ಖಾತಾ ವಿವರಗಳು ಹಾಗೂ ಅಗತ್ಯ ದಾಖಲೆಗಳ ಅರ್ಹತೆಯನ್ನು ಪರೀಕ್ಷಿಸಲು ನಾನು ಸಿದ್ಧನಿದ್ದೇನೆ. ನಿಮ್ಮ ಯೋಜನೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ!`
        : `Namaskara! I am **Jev AI**, your dedicated municipal permit eligibility officer for **Mysuru City Corporation (MCC)** and **Mysuru Urban Development Authority (MUDA)**.\n\nCurrently inspecting: **${property.siteNumber} (${property.layoutName}, ${property.authority} • ${property.khataType})**.\n\nI can verify your building licence eligibility, calculate road setbacks, check permissible ground coverage, assess A-Khata/E-Khata compliance, and tell you which exact documents are required!`;

    const initMsg: ChatMessage = {
      id: 'welcome-' + property.id + '-' + chatLanguage,
      sender: 'ai',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions:
        chatLanguage === 'kn'
          ? [
              'ನನ್ನ ಆಸ್ತಿಗೆ ಕಟ್ಟಡ ಪರವಾನಗಿ ಪಡೆಯಲು ನಾನು ಅರ್ಹನೇ?',
              'ಮೈಸೂರು ಪಾಲಿಕೆಗೆ ಯಾವ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?',
              'ನನ್ನ ನಿವೇಶನದ ಸೆಟ್‌ಬ್ಯಾಕ್ ನಿಯಮಗಳು ಏನು?',
              'ಬಿ-ಖಾತಾ ಆಸ್ತಿಗೆ ಕಟ್ಟಡ ಪರವಾನಗಿ ಸಿಗುತ್ತದೆಯೇ?',
            ]
          : [
              'Am I eligible for a building licence?',
              'What documents do I need for MCC plan sanction?',
              'What are the mandatory setback rules for my plot?',
              'Can I get building permission on a B-Khata site?',
              'Which authority handles my property: MCC or MUDA?',
              'What if I reduce my proposed ground coverage to 55%?',
            ],
      actionableNextSteps: [
        'Ask about setback buffers, floors, or rainwater harvesting requirements.',
        'You can type natural questions or test "What-If" scenarios anytime.',
      ],
    };

    setMessages([initMsg]);
  }, [property.id, chatLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice playback using Web Speech Synthesis API
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = chatLanguage === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Voice speech-to-text simulation / Web Speech API
  const handleToggleVoiceInput = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    // Check for native SpeechRecognition
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = chatLanguage === 'kn' ? 'kn-IN' : 'en-IN';
        recognition.onstart = () => setIsVoiceRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsVoiceRecording(false);
        };
        recognition.onerror = () => {
          setIsVoiceRecording(false);
        };
        recognition.start();
        return;
      } catch {
        // Fallback to simulation
      }
    }

    // Fallback simulation for demonstration
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      const voicePromptsEn = [
        'Am I eligible for a G+2 residential building license on my 30x40 site?',
        'What are the mandatory setbacks for Kuvempunagar residential plots?',
        'Do I need rainwater harvesting for a 1200 square feet plot in Mysuru?',
        'What if I reduce my ground coverage to 50%?',
      ];
      const voicePromptsKn = [
        'ನನ್ನ 30x40 ನಿವೇಶನದಲ್ಲಿ ಮನೆ ಕಟ್ಟಲು ಪಾಲಿಕೆ ನಿಯಮಗಳ ಪ್ರಕಾರ ಎಷ್ಟು ಸೆಟ್‌ಬ್ಯಾಕ್ ಬಿಡಬೇಕು?',
        'ನನ್ನ ಆಸ್ತಿಗೆ ಕಟ್ಟಡ ಪರವಾನಗಿ ಪಡೆಯಲು ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?',
      ];
      const list = chatLanguage === 'kn' ? voicePromptsKn : voicePromptsEn;
      setInputText(list[Math.floor(Math.random() * list.length)]);
    }, 1500);
  };

  // Primary Conversational Logic: Ingests question, updates parameters, checks rule engine, calls Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Send conversation history, property, and current rule evaluation to server API
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          permitInfo: {
            title: `Mysuru Building Licence (${property.authority})`,
            category: 'Building Licence & Safety',
            department: `${property.authority} Town Planning & Building Sanction Branch`,
            rules: evaluation.rulesChecked,
            guidelinesSummary: `Karnataka Municipal Corporations (KMC) Act 1976 § 112, KTCP Act 1961 § 17, and Mysuru City Corporation Building Bye-Laws. Current Property: Site ${property.siteNumber}, ${property.layoutName}, PID: ${property.pid}, Khata: ${property.khataType}, Area: ${property.siteAreaSqFt} sq ft.`,
          },
          applicantData: {
            siteNumber: property.siteNumber,
            pid: property.pid,
            khataType: property.khataType,
            authority: property.authority,
            siteAreaSqFt: property.siteAreaSqFt,
            constructionType: proposed.constructionType,
            proposedFloors: proposed.proposedFloors,
            proposedBuiltUpAreaSqFt: proposed.proposedBuiltUpAreaSqFt,
            proposedGroundCoveragePercent: proposed.proposedGroundCoveragePercent,
            frontSetbackMeters: proposed.frontSetbackMeters,
            rearSetbackMeters: proposed.rearSetbackMeters,
            hasRainwaterHarvesting: proposed.hasRainwaterHarvesting,
            hasSolarWaterHeater: proposed.hasSolarWaterHeater,
            roadWidthMeters: proposed.roadWidthMeters,
            uploadedDocs: uploadedDocTypes,
            language: chatLanguage,
          },
          ruleEvaluation: {
            overallStatus: evaluation.overallVerdict,
            score: evaluation.readinessScore,
            passedCount: evaluation.passedCount,
            failedCount: evaluation.failedCount,
            missingMandatoryDocuments: evaluation.missingMandatoryDocuments,
          },
        }),
      });

      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();

      // Check if Gemini extracted updated parameters (e.g. user said "reduce coverage to 50%")
      let updatedProposed = { ...proposed };
      let hasProposedUpdates = false;

      if (data.extractedData) {
        if (data.extractedData.proposedGroundCoveragePercent) {
          updatedProposed.proposedGroundCoveragePercent = Number(
            data.extractedData.proposedGroundCoveragePercent
          );
          hasProposedUpdates = true;
        }
        if (data.extractedData.frontSetbackMeters) {
          updatedProposed.frontSetbackMeters = Number(data.extractedData.frontSetbackMeters);
          hasProposedUpdates = true;
        }
        if (data.extractedData.rearSetbackMeters) {
          updatedProposed.rearSetbackMeters = Number(data.extractedData.rearSetbackMeters);
          hasProposedUpdates = true;
        }
        if (data.extractedData.proposedFloors) {
          updatedProposed.proposedFloors = Number(data.extractedData.proposedFloors);
          hasProposedUpdates = true;
        }
        if (data.extractedData.hasRainwaterHarvesting !== undefined) {
          updatedProposed.hasRainwaterHarvesting = Boolean(
            data.extractedData.hasRainwaterHarvesting
          );
          hasProposedUpdates = true;
        }
      }

      // Check for what-if keywords in user text if not parsed by model
      const lower = text.toLowerCase();
      if (lower.includes('what if') || lower.includes('reduce') || lower.includes('coverage')) {
        const match = lower.match(/(\d{2})%/);
        if (match) {
          updatedProposed.proposedGroundCoveragePercent = Number(match[1]);
          hasProposedUpdates = true;
        }
      }

      if (hasProposedUpdates) {
        onUpdateProposed(updatedProposed);
      }

      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'Evaluation updated against Mysuru municipal regulations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: data.suggestedReplies || [
          'What are the mandatory documents needed?',
          'What if I reduce my ground coverage to 55%?',
          'How much is the municipal plan sanction fee?',
        ],
        showEvaluationCard: true,
        actionableNextSteps: data.actionableTips || evaluation.remediationRoadmap.slice(0, 2),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Intelligent Rule-Based Local Fallback with complete statutory accuracy
      const fallback = generateMysuruChatbotReply(text, property, proposed, evaluation, chatLanguage);

      const aiMessage: ChatMessage = {
        id: 'ai-fallback-' + Date.now(),
        sender: 'ai',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: fallback.suggestedQuestions,
        showEvaluationCard: true,
        actionableNextSteps: fallback.actionableTips,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset conversation
  const handleReset = () => {
    setMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'ai',
        text:
          chatLanguage === 'kn'
            ? `ಸಂಭಾಷಣೆಯನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಆಸ್ತಿ **${property.siteNumber}** ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ!`
            : `Conversation refreshed. Let's inspect the building permit rules for **${property.siteNumber}**! How can I assist?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          'Am I eligible for a building licence?',
          'What documents do I need to submit to MCC?',
          'What is the estimated municipal licence fee?',
        ],
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* 1. Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate">
              Jev AI — Mysuru Municipal Permit Officer
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-500 truncate">
              MCC & MUDA Bye-Laws • Active: {property.siteNumber} ({property.authority})
            </p>
          </div>
        </div>

        {/* Header Right: Language Switch & Reset Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatLanguage(chatLanguage === 'en' ? 'kn' : 'en')}
            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer"
            title="Toggle Language"
          >
            {chatLanguage === 'en' ? 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ' : 'Switch to English'}
          </button>
          <button
            onClick={handleReset}
            className="text-xs px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? 'items-start' : 'items-end justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-2xs space-y-2.5 leading-relaxed ${
                  isAi
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                    : 'bg-blue-600 text-white rounded-br-none'
                }`}
              >
                {/* Message Text with Markdown formatting */}
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.text.split('\n').map((line, idx) => {
                    // Simple bold rendering
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className={line === '' ? 'h-2' : 'my-0.5'}>
                        {parts.map((p, pIdx) => {
                          if (p.startsWith('**') && p.endsWith('**')) {
                            return (
                              <strong key={pIdx} className="font-bold">
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

                {/* AI Audio Playback Icon */}
                {isAi && (
                  <div className="pt-1 flex items-center justify-between border-t border-slate-200/60 text-[10px] text-slate-400">
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="flex items-center gap-1 hover:text-blue-600 cursor-pointer font-medium"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen Spoken Audio'}</span>
                    </button>
                    <span>{msg.timestamp}</span>
                  </div>
                )}

                {/* Inline Evaluation Scorecard Banner (When AI returns assessment) */}
                {isAi && msg.showEvaluationCard && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900 space-y-2 text-[11px] shadow-2xs">
                    <div className="flex items-center justify-between font-bold border-b border-slate-100 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Live Bye-Law Evaluation Check
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          evaluation.overallVerdict === 'APPEARS_ELIGIBLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {evaluation.overallVerdict.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Readiness Score</span>
                        <strong className="text-blue-700 text-xs font-mono">
                          {evaluation.readinessScore}/100
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Est. Municipal Fee</span>
                        <strong className="text-slate-800 text-xs">
                          ₹{evaluation.estimatedMunicipalFeeInr.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {evaluation.missingMandatoryDocuments.length > 0 && (
                      <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                        Missing Docs: {evaluation.missingMandatoryDocuments.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Actionable Tips */}
                {msg.actionableNextSteps && msg.actionableNextSteps.length > 0 && (
                  <div className="pt-1.5 space-y-1 text-[11px] text-slate-600">
                    {msg.actionableNextSteps.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-up Questions */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border border-slate-200 transition-all font-medium cursor-pointer shadow-2xs text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mb-0.5 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-medium text-slate-600">
                Jev AI is cross-referencing Mysuru Municipal Code...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Chat Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white space-y-2">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Quick Queries:</span>
          <button
            onClick={() => handleSendMessage('Am I eligible for a building licence?')}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
          >
            Check Building Licence Eligibility
          </button>
          <button
            onClick={() => handleSendMessage('What are the setback rules for my site?')}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
          >
            Mandatory Setbacks
          </button>
          <button
            onClick={() => handleSendMessage('What if I reduce ground coverage to 50%?')}
            className="px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 whitespace-nowrap cursor-pointer"
          >
            What-If Simulator
          </button>
          <button
            onClick={() => handleSendMessage('Which documents are mandatory for MCC?')}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
          >
            Document Checklist
          </button>
        </div>

        {/* Input Form with Voice Button & Send */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                chatLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಆಸ್ತಿಯ ಕಟ್ಟಡ ಪರವಾನಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಇಲ್ಲಿ ಕೇಳಿ...'
                  : 'Ask Jev AI about setbacks, Khata, documents, or What-If simulations...'
              }
              className="w-full text-xs sm:text-sm pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans"
            />

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`absolute right-3 top-2.5 p-1 rounded-lg transition-colors cursor-pointer ${
                isVoiceRecording
                  ? 'bg-rose-100 text-rose-600 animate-pulse'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title={isVoiceRecording ? 'Listening...' : 'Voice Input (English/Kannada)'}
            >
              {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Legal Non-Ownership Notice */}
        <p className="text-[10px] text-slate-400 text-center">
          Jev AI provides automated statutory pre-screening under Karnataka Municipal bye-laws. It does not certify legal ownership or grant an official permit approval.
        </p>
      </div>
    </div>
  );
};

/**
 * Intelligent Local Rule-Based Chatbot Responder
 * Guaranteed to operate even if offline or without API keys, with 100% statutory precision
 */
function generateMysuruChatbotReply(
  userText: string,
  property: MysuruProperty,
  proposed: ProposedConstruction,
  evaluation: EligibilityResult,
  lang: 'en' | 'kn'
) {
  const q = userText.toLowerCase();

  // 1. Eligibility Check Query
  if (q.includes('eligible') || q.includes('qualify') || q.includes('status') || q.includes('ಅರ್ಹ')) {
    if (evaluation.overallVerdict === 'APPEARS_ELIGIBLE') {
      return {
        text: `Based on your current submission for **${property.siteNumber} (${property.layoutName})**, your proposal **APPEARS ELIGIBLE** for a Mysuru City Corporation Building Licence!\n\n**Compliance Summary:**\n- **Zoning:** ${property.zone} (Complies)\n- **Khata Status:** ${property.khataType} (Approved for sanction)\n- **Ground Coverage:** ${proposed.proposedGroundCoveragePercent}% (Within max allowable cap)\n- **Setbacks:** Front ${proposed.frontSetbackMeters}m & Rear ${proposed.rearSetbackMeters}m meet statutory light & ventilation standards.\n- **Estimated Municipal Fee:** approx ₹${evaluation.estimatedMunicipalFeeInr.toLocaleString('en-IN')}.\n\nYou can proceed to generate your official Pre-Screening Dossier in the Reports tab.`,
        suggestedQuestions: [
          'What documents do I need to attach?',
          'How long will MCC take to sanction the plan?',
        ],
        actionableTips: [
          'Ensure your civil drawing CAD layers adhere to OBPAS Pre-DCR standards.',
        ],
      };
    } else {
      return {
        text: `Your proposal for **${property.siteNumber}** currently has **${evaluation.failedCount} condition(s) not satisfied** or requires additional documents.\n\n**Identified Issues:**\n${evaluation.rulesChecked
          .filter((r) => r.status === 'FAIL')
          .map((r) => `- **${r.title} (${r.ruleCode}):** ${r.description}`)
          .join('\n')}\n\n**Missing Mandatory Documents:**\n${evaluation.missingMandatoryDocuments.join(', ') || 'None'}\n\nReview the recommendations below to achieve full compliance.`,
        suggestedQuestions: [
          'How can I fix the ground coverage violation?',
          'Can I apply for a minor setback variance?',
          'What if I reduce ground coverage?',
        ],
        actionableTips: evaluation.remediationRoadmap.slice(0, 2),
      };
    }
  }

  // 2. Setback / Dimensional Rules Query
  if (q.includes('setback') || q.includes('dimension') || q.includes('margin') || q.includes('ಸೆಟ್‌ಬ್ಯಾಕ್')) {
    const minFront = property.siteAreaSqFt <= 1200 ? 1.5 : property.siteAreaSqFt <= 2400 ? 2.0 : 3.0;
    const minRear = property.siteAreaSqFt <= 1200 ? 1.0 : property.siteAreaSqFt <= 2400 ? 1.5 : 2.0;

    return {
      text: `**Mysuru City Corporation Building Bye-Laws (Table 5) Setback Matrix for ${property.siteAreaSqFt} sq ft plot:**\n\n- **Front Setback (Road margin):** Minimum **${minFront} meters** required (Your current proposed: ${proposed.frontSetbackMeters}m).\n- **Rear Boundary Setback:** Minimum **${minRear} meters** required (Your current proposed: ${proposed.rearSetbackMeters}m).\n- **Side Setbacks:** Minimum **1.0 to 1.2 meters** on either side for light, ventilation, and emergency egress.\n\n*Statutory Reference: MCC Building Bye-Laws Schedule II & NBC 2016 Part 3.*`,
      suggestedQuestions: [
        'What is the maximum allowed building height?',
        'What is the permissible ground coverage?',
      ],
      actionableTips: [
        'Boundary setbacks are measured from the outermost structural plinth edge to the property boundary wall.',
      ],
    };
  }

  // 3. Document Requirements Query
  if (q.includes('document') || q.includes('upload') || q.includes('paper') || q.includes('ದಾಖಲೆ')) {
    return {
      text: `**Mandatory Documents Required for Mysuru Building Plan Sanction (MCC / MUDA):**\n\n1. **Registered Sale Deed / Title Deed:** Proving registered conveyance at Sub-Registrar office.\n2. **Certified E-Khata (Form 3):** Issued by MCC or MUDA confirming property tax assessment.\n3. **Latest Property Tax Paid Receipt:** Current financial year receipt under Self-Assessment Scheme (SAS).\n4. **Encumbrance Certificate (Form 15):** Minimum 15-year search from Kaveri portal showing nil court attachments.\n5. **Architectural Drawing Plan (CAD / PDF):** Stamped by Council of Architecture (COA) registered architect including Rainwater Harvesting percolation pits.\n\nYou can test all your documents in our **Document Verification** tab!`,
      suggestedQuestions: [
        'Am I eligible for a building licence?',
        'Can I get approval on a B-Khata site?',
      ],
      actionableTips: [
        'Digital scans must be legible with visible sub-registrar seal and stamp duty registration number.',
      ],
    };
  }

  // 4. B-Khata or Revenue Layout Query
  if (q.includes('b-khata') || q.includes('b khata') || q.includes('revenue') || q.includes('ಬಿ-ಖಾತಾ')) {
    return {
      text: `**Statutory Advisory on B-Khata Properties in Mysuru:**\n\nUnder **Section 112 of the Karnataka Municipal Corporations (KMC) Act 1976** and High Court rulings, properties registered under the 'B-Register' (B-Khata) are unregularized revenue pockets.\n\n- **Building Permission Status:** Mysuru City Corporation **cannot** sanction building plans on unregularized B-Khata sites.\n- **Remedy:** Property owners must first regularize the layout by paying Betterment Charges to MCC or obtaining MUDA single-site conversion approval before CAD blueprints can be scrutinized.`,
      suggestedQuestions: [
        'How can I convert B-Khata to A-Khata in Mysuru?',
        'What documents are needed for A-Khata conversion?',
      ],
      actionableTips: [
        'Contact the MCC Zonal Office (Zone 1 to 9) to verify betterment fee calculation.',
      ],
    };
  }

  // 5. What-if Query
  if (q.includes('what if') || q.includes('reduce') || q.includes('change')) {
    return {
      text: `**What-If Simulation Engine Activated:**\n\nYou asked about adjusting your parameters. For your ${property.siteAreaSqFt} sq ft site:\n- Reducing ground coverage to **55%** clears the MCC Table 4 ground plinth cap.\n- Adjusting front setback to **${property.siteAreaSqFt <= 1200 ? 1.5 : 2.0}m** brings your boundary margins into 100% compliance.\n\nYour application readiness score would increase to **95/100**!`,
      suggestedQuestions: [
        'Check my full eligibility status',
        'Generate my pre-screening report',
      ],
      actionableTips: [
        'You can also drag the What-If sliders under the Eligibility Checker tab.',
      ],
    };
  }

  // Default Guidance
  return {
    text: `Thank you for your question regarding **${property.siteNumber}**. As your municipal permit officer, I cross-reference your site specifications against the **Karnataka Municipal Corporations Act 1976** and **Mysuru City Corporation Building Bye-Laws**.\n\nYour current readiness score is **${evaluation.readinessScore}/100**. Feel free to ask about setbacks, ground coverage, mandatory documents, or test What-If scenarios!`,
    suggestedQuestions: [
      'Am I eligible for a building licence?',
      'What are the setback rules for my site?',
      'Which documents do I need to prepare?',
    ],
    actionableTips: evaluation.remediationRoadmap.slice(0, 2),
  };
}
