import React, { useState } from 'react';

interface SupportFormProps {
    darkMode?: boolean;
    onClose: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ darkMode = false, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // В реальном проекте здесь был бы API-запрос
        console.log('Отправка запроса в поддержку:', { name, email, question });

        // Имитация успешной отправки
        setTimeout(() => {
            setIsSubmitted(true);
        }, 500);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-between text-center">
                <h2 className="text-3xl font-bold mb-6">Запрос был успешно отправлен!</h2>

                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <p className="text-lg mb-4">Мы начнём обработку вашего обращения в кратчайшие сроки. Наши специалисты работают над тем, чтобы предоставить вам необходимую помощь и ответить на ваши вопросы.</p>

                <p className="text-lg mb-8">Спасибо, что обратились к нам! Мы ценим ваше время и постараемся ответить как можно скорее.</p>

                <button
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 text-xl font-medium hover:bg-opacity-90 transition-all"
                >
                    Закрыть
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-6">Остались вопросы?</h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-full p-6">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ваше имя"
                        required
                        className={`w-full p-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-dark border-gray-300'} border focus:outline-none focus:border-primary transition-colors`}
                    />
                </div>

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ваша почта для связи"
                        required
                        className={`w-full p-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-dark border-gray-300'} border focus:outline-none focus:border-primary transition-colors`}
                    />
                </div>

                <div>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ваш вопрос"
                        required
                        rows={5}
                        className={`w-full p-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-dark border-gray-300'} border focus:outline-none focus:border-primary transition-colors resize-none`}
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-primary text-white px-8 py-3 text-xl font-medium hover:bg-opacity-90 transition-all"
                    >
                        Отправить
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupportForm;
