import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ChatBotIcon from "../../assets/Isotipos/chatbot.png";
import { Button, Input, Card, CardBody, CardHeader, ScrollShadow, Divider } from "@heroui/react";
import axios from "../../axios";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: "bot", text: "Hola! Soy el asistente virtual de la Escuela de Posgrado de la UNPRG. ¿En qué puedo ayudarte hoy?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            return /android|iphone|ipad|ipod/i.test(userAgent);
        };
        setIsMobile(checkIfMobile());
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { type: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post('/chat', { message: userMsg });
            const botReply = response.data.data.reply;
            setMessages(prev => [...prev, { type: "bot", text: botReply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                type: "bot",
                text: "Lo siento, tuve un problema al procesar tu mensaje. Puedes escribirnos a admision_epg@unprg.edu.pe o al WhatsApp 995901454 / 924545013. Además únete a nuestra comunidad para estar informado de todas las novedades: https://chat.whatsapp.com/FQjt9M0b5hn56cQ8NrYlll"
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return createPortal(
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end pointer-events-none">
            {/* Chat Window - Enable pointer events for content */}
            {isOpen && (
                <Card className={`mb-4 w-80 md:w-96 shadow-xl border border-gray-200 transition-all duration-300 pointer-events-auto ${isMobile ? 'fixed inset-0 m-0 w-full h-full z-[60]' : 'h-[500px]'}`}>
                    <CardHeader className="flex justify-between items-center bg-blue-900 text-white p-4 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white p-1">
                                <img src={ChatBotIcon} alt="Bot" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold">Asistente Virtual EPG</span>
                        </div>
                        <Button isIconOnly size="sm" variant="light" className="text-white" onClick={() => setIsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-0 flex flex-col h-full bg-gray-50 overflow-hidden">
                        <ScrollShadow className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                        }`}>
                                        {msg.type === 'user' ? (
                                            msg.text
                                        ) : (
                                            <div dangerouslySetInnerHTML={{
                                                __html: msg.text
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/(^|\n)\*\s/g, '$1• ')
                                                    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-600 underline break-all">$1</a>')
                                                    .replace(/\n/g, '<br />')
                                            }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm rounded-bl-none flex items-center gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </ScrollShadow>
                        <div className="p-3 bg-white border-t border-gray-200">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Escribe tu consulta..."
                                    value={input}
                                    onValueChange={setInput}
                                    onKeyDown={handleKeyPress}
                                    isDisabled={loading}
                                    size="sm"
                                    classNames={{
                                        input: "text-sm",
                                        inputWrapper: "h-10 border-1 border-gray-300"
                                    }}
                                />
                                <Button isIconOnly color="primary" onClick={handleSend} isLoading={loading} size="sm" className="h-10 w-10 min-w-10">
                                    {!loading && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Floating Toggle Button - Enable pointer events */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-900 border-4 border-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group pointer-events-auto"
                >
                    <img src={ChatBotIcon} alt="Chat" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform" />
                    {/* Badge de notification opcional */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            )}
        </div>,
        document.body
    );
};

export default Chatbot;
