import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiTrash2, FiMail } from 'react-icons/fi';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMessages();
    }, [page]);

    const fetchMessages = async () => {
        try {
            const data = await contactService.getAllMessages(page);
            setMessages(data.messages);
            setTotalPages(Math.ceil(data.total / 10));
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await contactService.deleteMessage(id);
            toast.success('Message deleted successfully');
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Contact Messages</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No messages found
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {messages.map((msg) => (
                            <div key={msg.MessageID} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <FiMail className="text-[#0BA5EC]" />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {msg.Name}
                                        </h3>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            ({msg.Email})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(msg.CreatedAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(msg.MessageID)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete Message"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                                    {msg.Message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */
                totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 dark:text-white">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
                        >
                            Next
                        </button>
                    </div>
                )}
        </div>
    );
};

export default Messages;
