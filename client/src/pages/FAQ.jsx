import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const { t } = useTranslation();

    const faqs = [
        {
            question: "What is Khadamati?",
            answer: "Khadamati is a platform that connects service providers with customers seeking various home and professional services."
        },
        {
            question: "How do I register?",
            answer: "You can register as a customer or a service provider by clicking on the 'Register' button in the top right corner."
        },
        {
            question: "Is it free to use?",
            answer: "Registration is free for customers. Service providers may have different subscription plans or commission rates."
        },
        {
            question: "How can I contact support?",
            answer: "You can reach out to our support team via the 'Contact Us' page or email us at support@khadamati.com."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        {t('footer.faq', 'Frequently Asked Questions')}
                    </h1>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FAQ;
