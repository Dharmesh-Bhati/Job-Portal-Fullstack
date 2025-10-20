import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const ConfirmEmail = () => {
    const [message, setMessage] = useState('Verifying your email...');
    const [isSuccess, setIsSuccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const confirmUserEmail = async () => {
             const params = new URLSearchParams(location.search);
            const userId = params.get('userId');
            const token = params.get('token');

            if (!userId || !token) {
                setMessage('Invalid confirmation link.');
                setIsSuccess(false);
                return;
            }

             
            const apiUrl = `${API_URL}/Account/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`;

            try {
                const response = await axios.get(apiUrl);

                 setMessage(response.data.message || 'Email confirmed successfully. You can now log in!');
                setIsSuccess(true);
            } catch (error) {
                 const errorMessage = error.response?.data?.message || 'Error confirming email. Please try again or contact support.';
                setMessage(errorMessage);
                setIsSuccess(false);
                console.error('Email confirmation error:', error);
            }
        };

         if (typeof axios !== 'undefined') {
            confirmUserEmail();
        } else {
            setMessage('Loading dependencies...');
        }
    }, [location.search]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                 <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    margin: '0 auto 1rem',
                    backgroundColor: isSuccess ? '#D1FAE5' : '#FEE2E2',
                    transition: 'background-color 0.3s'
                }}>
                    {isSuccess ? (
                         <svg style={{ width: '24px', height: '24px', color: '#047857' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                         <svg style={{ width: '24px', height: '24px', color: '#B91C1C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                    {isSuccess ? 'Success!' : 'Error!'}
                </h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div>
                    <a href="/login" className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                        Go To Login Page 
                    </a>
                </div>
            </div>
        </div>
    );
};

 const axiosScript = document.createElement('script');
axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
document.head.appendChild(axiosScript);

export default ConfirmEmail;
