import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        {t('footer.termsOfService', 'Terms of Service')}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using Khadamati, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
                            <p>
                                Khadamati provides a platform for connecting service providers with customers. We are not a party to any agreement between users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. User Conduct</h2>
                            <p>
                                You agree to use the service only for lawful purposes. You are responsible for all content you post and activity that occurs under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Privacy Policy</h2>
                            <p>
                                Your use of the site is also governed by our Privacy Policy. Please review our Privacy Policy for information on how we collect and use your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Modifications</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of those changes.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
