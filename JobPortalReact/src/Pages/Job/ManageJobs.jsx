import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_Job || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRecruiter, setIsRecruiter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    setIsAuthenticated(true);
                    setIsRecruiter(userRole === 'Recruiter');
                } catch (err) {
                    console.error("Invalid token:", err);
                    setIsAuthenticated(false);
                    setIsRecruiter(false);
                    // Redirect to login if token is invalid
                    navigate('/login');
                }
            } else {
                setIsAuthenticated(false);
                setIsRecruiter(false);
                // Redirect to login if not authenticated
                navigate('/login');
            }
        };

        const fetchJobs = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/manage`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setJobs(response.data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
        fetchJobs();
    }, [navigate]);

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return;
        }

        const token = localStorage.getItem('userToken');
        try {
            await axios.delete(`${API_BASE_URL}/delete/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update the jobs list in state to remove the deleted job
            setJobs(jobs.filter(job => job.id !== jobId));
            alert('Job deleted successfully!');
        } catch (err) {
            console.error("Failed to delete job:", err);
            alert("An error occurred while deleting the job.");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    // Unauthorized access handling
    if (!isAuthenticated || !isRecruiter) {
        return <div className="text-center mt-5">You do not have permission to view this page.</div>;
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header" style={{
                background: 'url(/assets/img/banner1.jpg) no-repeat center center',
                backgroundSize: 'cover',
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw'
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">Manage Jobs</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Manage Jobs</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-4 col-xs-12">
                            <div className="right-sideabr">
                                <div className="inner-box">
                                    <h4>Manage Account</h4>
                                    <ul className="lest item">
                                        <li><Link className="active" to="/Job/ManageJobs">Manage Jobs</Link></li>
                                        <li><Link to="/ManageApplication/ManageApplications">Manage Applications</Link></li>
                                    </ul>
                                    <ul className="lest">
                                        <li><Link to="/change-password">Change Password</Link></li>
                                        <li><Link to="/logout">Sign Out</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 col-sm-8 col-xs-12">
                            <div className="job-alerts-item candidates">
                                <h3 className="alerts-title">Manage Jobs</h3>
                                {error && <div className="alert alert-danger">{error}</div>}

                                {jobs.length > 0 ? (
                                    <table className="table table-striped table-bordered" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Job Title & Location</th>
                                                <th>Job Type</th>
                                                <th>Applications</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.map(job => (
                                                <tr key={job.id}>
                                                    <td>
                                                        <Link to={`/job-detail/${job.id}`}>
                                                            <h3>{job.jobTitle}</h3>
                                                        </Link>
                                                        <span className="location"><i className="ti-location-pin"></i> {job.location}</span>
                                                    </td>
                                                    <td>
                                                        <p><span className="full-time">{job.jobType}</span></p>
                                                    </td>
                                                    <td>
                                                        <Link to={`/ManageApplication/ViewApplicants/${job.id}`}>
                                                            {job.totalApplications} Applications
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={`/Job/EditJob/${job.id}`} className="btn btn-primary btn-sm">Edit</Link>
                                                        <button
                                                            onClick={() => handleDelete(job.id)}
                                                            className="btn btn-danger btn-sm"
                                                            style={{ marginLeft: '5px' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center">
                                        <h4>You have not posted any jobs yet.</h4>
                                        <p>Click <Link to="/post-job">here</Link> to post a new job.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageJobs;