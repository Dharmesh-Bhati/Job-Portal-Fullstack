import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'FALLBACK_URL_IF_ENV_IS_MISSING';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

     const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
             const response = await axios.post(`${API_URL}/Account/login`, {
                email,
                password,
            });

          
            if (response.data.token) {
                 localStorage.setItem('userToken', response.data.token);
                 navigate('/');
            } else {
                 setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
             if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Page Header Section */}
            <div class="page-header" style={{ backgroundImage: 'url(/assets/img/banner1.jpg)' }}>
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="breadcrumb-wrapper">
                                <h2 class="product-title">Login</h2>
                                <ol class="breadcrumb">
                                    <li><a href="/Home"><i class="ti-home"></i> Home</a></li>
                                    <li class="current">Login</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content section with form */}
            <div id="content" className="my-account">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-6 cd-user-modal">
                            <div className="my-account-form">
                                <div id="cd-login" className="is-selected">
                                    <div className="page-login-form">
                                        <form onSubmit={handleSubmit} className="login-form">
                                            {/* Display Error Message if any */}
                                            {error && <div className="text-danger">{error}</div>}

                                            <div className="form-group">
                                                <div className="input-icon">
                                                    <i className="ti-user"></i>
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

                                            <button
                                                type="submit"
                                                className="btn btn-common log-btn"
                                                disabled={loading}
                                            >
                                                {loading ? 'Logging in...' : 'Login'}
                                            </button>

                                            <div className="checkbox-item">
                                                <div className="checkbox">
                                                    <label htmlFor="rememberme" className="rememberme">
                                                        <input type="checkbox" id="rememberme" />
                                                        Remember Me
                                                    </label>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <p>
                                                        <Link to="/forgot-password">Lost your password?</Link>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <p>
                                                    Don't have an account?
                                                    <Link to="/register">Create an account</Link>
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

            {/* Back to top and Loading spinner (optional) */}
            <a href="#" className="back-to-top">
                <i className="ti-arrow-up"></i>
            </a>

             
        </>
    );
}

export default LoginPage;