import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'FALLBACK_URL_IF_ENV_IS_MISSING';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages and errors
        setMessage('');
        setError('');

        // Client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!userType) {
            setError('Please select a user type.');
            return;
        }

        setLoading(true);
        const registrationData = {
            email: email, 
            password: password,   
            confirmPassword: confirmPassword,  
            UserType: userType  
        };

        try {
             
            const response = await axios.post(`${API_URL}/Account/register`, registrationData);

            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            
            if (err.response) {
                setError(err.response.data.message || 'Registration failed. Please try again.');
            } else {
                setError('An error occurred. Please check your network connection.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    .my-account {
                        padding: 60px 0;
                        background-color: #f8f9fa;
                    }
                    .my-account-form {
                        background: #fff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                     
                    .product-title {
                        font-size: 2.5em;
                        margin-bottom: 10px;
                    }
                    
                    .form-group .input-icon i {
                        position: absolute;
                        left: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #aaa;
                        marging-top:4px;:
                    }
                    .form-group .input-icon input,
                    .form-group .input-icon select {
                        padding-left: 40px;
                        border-radius: 5px;
                    }
                    .log-btn {
                        background-color: #ff4f57;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        width: 100%;
                        font-size: 1.1em;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                     
                    .text-danger {
                        color: #dc3545;
                        font-size: 0.9em;
                        margin-top: 5px;
                    }
                    .text-success {
                        color: #28a745;
                        font-size: 0.9em;
                        margin-top: 5px;
                    }
                    .spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        border-left-color: #ffffff;
                        animation: spin 1s ease infinite;
                        margin: 0 auto;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div className="page-header" style={{ backgroundImage: 'url(/assets/img/banner1.jpg)' } }>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">Register</h2>
                                <ol className="breadcrumb">
                                    <li><a href="/Home"><i class="ti-home"></i> Home</a></li>
                                    <li class="current">Register</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="content" className="my-account">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-6 cd-user-modal">
                            <div className="my-account-form">
                                <div id="cd-register" className="is-selected">
                                    <div className="page-register-form">
                                        <form onSubmit={handleSubmit} className="register-form">
                                            {error && <div className="text-danger mb-3 text-center">{error}</div>}
                                            {message && <div className="text-success mb-3 text-center">{message}</div>}

                                            <div className="form-group">
                                                <div className="input-icon">
                                                    <i className="ti-email"></i>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="input-icon">
                                                    <i className="ti-lock"></i>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="input-icon">
                                                    <i className="ti-lock"></i>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="input-icon">
                                                    <i className="ti-briefcase"></i>
                                                    <select
                                                        className="form-control"
                                                        value={userType}
                                                        onChange={(e) => setUserType(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Register as...</option>
                                                        <option value="Recruiter">Recruiter</option>
                                                        <option value="JobSeeker">JobSeeker</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn btn-common log-btn" disabled={loading}>
                                                {loading ? <div className="spinner"></div> : 'Register'}
                                            </button>

                                            <div className="mt-4 text-center">
                                                <p>
                                                    Already have an account?
                                                    <Link to="/login" className="white"> Login</Link>
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a href="#" className="back-to-top">
                <i className="ti-arrow-up"></i>
            </a>
        </>
    );
}

export default Register;
