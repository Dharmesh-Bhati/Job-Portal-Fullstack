import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ManageApplication || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const ViewApplicants = () => {
     const { jobId } = useParams();
    const navigate = useNavigate();

    // State hooks for data and loading
    const [jobData, setJobData] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

     const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        const fetchApplicants = async () => {
            const token = localStorage.getItem('userToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // API Call
                const response = await axios.get(`${API_BASE_URL}/recruiter/job/${jobId}/applicants`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const fetchedViewModel = response.data;

                setJobData(fetchedViewModel);  
                setApplicants(fetchedViewModel.applicants);  
                setError(null);

            } catch (err) {
                console.error("Failed to fetch applicants:", err);
                setError("Applicants data load nahi ho paya ya job post nahi mili.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId, navigate]);  

    // --- Loading and Error States ---
    if (loading) {
        return <div className="text-center mt-5">Loading Applicants...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

     if (!jobData) {
        return <div className="text-center mt-5">Job details available nahi hain.</div>;
    }

    // --- JSX Render ---
    return (
        <>
             
            <style jsx="true">{`
                .applicants-list .row.header {
                    font-weight: bold;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                .applicants-list .applicant-row {
                    border-bottom: 1px solid #f0f0f0;
                    padding: 10px 0;
                }
                .applicants-list .applicant-row h4 {
                    margin: 0;
                    font-size: 16px;
                }
                .applicants-list .applicant-row p {
                    margin: 0;
                }
            `}</style>

            <div id="content">
                <div className="container">
                    <div className="row">
                        {/* Left Sidebar (Recruiter Navigation) */}
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="right-sideabr">
                                <div className="inner-box">
                                    <h4>Manage Account</h4>
                                    <ul className="lest item">
                                         <li><a href="/recruiter/resume">My Resume</a></li>
                                        <li><a href="/recruiter/bookmarked">Bookmarked Jobs</a></li>
                                        <li><a href="/recruiter/notifications">Notifications <span className="notinumber">2</span></a></li>
                                    </ul>
                                    <h4>Manage Job</h4>
                                    <ul className="lest item">
                                        <li><Link to="/Job/ManageJobs">Manage Jobs</Link></li>
                                        <li><a className="active" href="/recruiter/manage-applications">Manage Applications</a></li>
                                    </ul>
                                    <ul className="lest">
                                        <li><a href="/recruiter/change-password">Change Password</a></li>
                                        <li><a href="/logout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Content (Applicants List) */}
                        <div className="col-md-8 col-sm-8 col-xs-12">
                            <div className="job-alerts-item candidates">
                                <h3 className="alerts-title">Applicants for: {jobData.jobTitle}</h3>

                                {applicants && applicants.length > 0 ? (
                                    <div className="applicants-list">
                                        {/* Header Row */}
                                        <div className="row header hidden-xs">
                                            <div className="col-md-3"><p>Applicant Name</p></div>
                                            <div className="col-md-3"><p>Profession</p></div>
                                            <div className="col-md-3"><p>Location</p></div>
                                            <div className="col-md-3"><p>Applied On</p></div>
                                        </div>

                                        {applicants.map((application, index) => (
                                            <div key={index} className="row applicant-row">
                                                {/* Applicant Name */}
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                     <h4>{application.applicantName || 'N/A'}</h4>
                                                </div>

                                                {/* Profession */}
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                    <p>
                                                        {application.professionTitle ? (
                                                            <span>{application.professionTitle}</span>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Location */}
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                    <p>
                                                        {application.location ? (
                                                            <>
                                                                <i className="ti-location-pin"></i> <span>{application.location}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Applied On */}
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                     <p>{formatDate(application.appliedDate)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <h4>No applications found for this job.</h4>
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

export default ViewApplicants;