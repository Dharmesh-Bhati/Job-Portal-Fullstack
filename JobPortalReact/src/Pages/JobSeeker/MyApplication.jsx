import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL_ManageApplication || 'FALLBACK_URL_IF_ENV_IS_MISSING';

// Helper function for status badge styling
const getStatusBadge = (status) => {
    let className = 'badge bg-secondary';
    if (status === 'Approved') {
        className = 'badge bg-success';
    } else if (status === 'Rejected') {
        className = 'badge bg-danger';
    }
    return <span className={className}>{status}</span>;
};

// Helper function to format the date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Logic (Equivalent to Controller's [HttpGet("myapplications")]) ---
    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem('userToken'); // Assuming token is stored here

            if (!token) {
                setError("Authentication token missing. Please log in.");
                setLoading(false);
                return;
            }

            const API_URL = `${BASE_API_URL}/myapplications`;

            try {
                const response = await axios.get(API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                
                setApplications(response.data);
            } catch (err) {
                console.error("Error fetching my applications:", err);
                if (err.response && err.response.status === 404) {
                     
                    setApplications([]);  
                    setError(null);
                } else {
                    setError("Failed to load applications. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // --- Rendering Logic ---
    if (loading) return <div className="text-center mt-5 p-5">Loading your applications...</div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <>
            {/* Header Section (Converted Razor HTML to JSX) */}
            <div className="page-header" style={{
                backgroundImage: 'url(/assets/img/banner1.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">My Job Applications</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Find Job</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div id="content">
                <div className="container">
                    <div className="row">
                        {/* Left Sidebar (Converted Razor HTML to JSX) */}
                        <div className="col-md-3 col-sm-4 col-xs-12">
                            <div className="right-sideabr">
                                <div className="inner-box">
                                    <h4>Manage Account</h4>
                                    <ul className="lest item">
                                        <li><Link to="/jobseeker/myresume">My Resume</Link></li>
                                        <li><Link className="active" to="/manageapplication/myapplications">My Application</Link></li>
                                    </ul>
                                    <ul className="lest">
                                        <li><Link to="/account/forgotpassword">Change Password</Link></li>
                                        <li><Link to="/account/logout">Sign Out</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="col-md-9">
                            <div className="job-alerts-item">
                                <h3 className="alerts-title">My Applications</h3>

                                {applications.length === 0 ? (
                                    <div className="alert alert-info">
                                        You have not applied for any jobs yet.
                                    </div>
                                ) : (
                                    <table id="myApplicationsTable" className="table table-striped table-hover table-bordered" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Job Title</th>
                                                <th>Company</th>
                                                <th>Applied Date</th>
                                                <th>Current Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map(application => (
                                                <tr key={application.id}>
                                                    {/* Accessing nested properties */}
                                                    <td>{application.jobTitle || 'N/A'}</td>
                                                    <td>{application.companyName || 'N/A'}</td>
                                                    <td>{formatDate(application.appliedDate)}</td>
                                                    <td>
                                                        {getStatusBadge(application.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyApplications;