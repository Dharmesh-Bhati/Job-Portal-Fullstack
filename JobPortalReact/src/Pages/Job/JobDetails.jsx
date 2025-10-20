import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_Job || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isJobSeeker, setIsJobSeeker] = useState(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    setIsAuthenticated(true);
                    setIsJobSeeker(userRole === 'JobSeeker');
                } catch (err) {
                    console.error("Invalid token:", err);
                    setIsAuthenticated(false);
                    setIsJobSeeker(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsJobSeeker(false);
            }
        };

        const fetchJobDetail = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${id}`);
                setJob(response.data);
            } catch (err) {
                console.error("Failed to fetch job detail:", err.response);
                setError("Failed to load job details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
        fetchJobDetail();
    }, [id]);

    const handleApply = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("You need to log in to apply for a job.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/apply/${job.jobId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Your application has been submitted successfully!');
        } catch (err) {
            console.error("Application failed:", err.response);
            if (err.response && err.response.status === 409) {
                alert("You have already applied for this job.");
            } else if (err.response && err.response.status === 400) {
                alert("Your job seeker profile does not exist. Please create your resume first.");
            } else {
                alert("An error occurred while applying. Please try again.");
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading job details...</div>;
    }

    if (error) {
        return <div className="text-center mt-5">{error}</div>;
    }

    if (!job) {
        return <div className="text-center mt-5">Job not found.</div>;
    }

    const postedDate = new Date(job.postedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const backendUrl = 'https://localhost:7203/';

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
                                <h2 className="product-title">Job Details</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Job Details</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Details Section */}
            <section className="job-detail section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="header-detail">
                                <div className="header-content pull-left">
                                    <h3><a href="#">{job.jobTitle}</a></h3>
                                    <p><span>Date Posted: {postedDate}</span></p>
                                    <p>Monthly Salary: <strong className="price">Not Specified</strong></p>
                                </div>
                                <div className="detail-company pull-right text-right">
                                    <div className="img-thum">
                                        <img className="img-responsive" src={`${backendUrl}${job.companyLogoUrl}`} alt={job.companyName} style={{ maxWidth: '150px' }} />
                                    </div>
                                    <div className="name">
                                        <h4>{job.companyName}</h4>
                                        <h5>{job.city}, {job.region}</h5>
                                        <p>{job.vacancy} Current jobs openings</p>
                                    </div>
                                </div>
                                <div className="clearfix">
                                    <div className="meta">
                                        {/* These links are placeholder in the original HTML, you might want to remove or change them */}
                                        <span><a className="btn btn-border btn-sm" href="#"><i className="ti-email"></i> Email</a></span>
                                        <span><a className="btn btn-border btn-sm" href="#"><i className="ti-info-alt"></i> Job Alert</a></span>
                                        <span><a className="btn btn-border btn-sm" href="#"><i className="ti-save"></i> Save This job</a></span>
                                        <span><a className="btn btn-border btn-sm" href="#"><i className="ti-alert"></i> Report Abuse</a></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8 col-sm-12 col-xs-12">
                            <div className="content-area">
                                <div className="clearfix">
                                    <div className="box">
                                        <h4>Job Description</h4>
                                        <p>{job.jobDescription}</p>
                                        <h4>Required Skills</h4>
                                        <p>{job.skills}</p>
                                    </div>
                                </div>
                                {isAuthenticated && isJobSeeker && (
                                    <button
                                        onClick={handleApply}
                                        className="btn btn-common"
                                    >
                                        Apply for this Job Now
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-12 col-xs-12">
                            <aside>
                                <div className="sidebar">
                                    <div className="box">
                                        <h2 className="small-title">Job Details</h2>
                                        <ul className="detail-list">
                                            <li>
                                                <a href="#">Location</a>
                                                <span className="type-posts">{job.companyAddress}, {job.city}, {job.region}, {job.country}</span>
                                            </li>
                                            <li>
                                                <a href="#">Company</a>
                                                <span className="type-posts">{job.companyName}</span>
                                            </li>
                                            <li>
                                                <a href="#">Job Category</a>
                                                <span className="type-posts">{job.jobCategory}</span>
                                            </li>
                                            <li>
                                                <a href="#">Job Type</a>
                                                <span className="type-posts">{job.jobType}</span>
                                            </li>
                                            <li>
                                                <a href="#">Positions</a>
                                                <span className="type-posts">{job.vacancy}</span>
                                            </li>
                                            <li>
                                                <a href="#">Experience Level</a>
                                                <span className="type-posts">{job.experienceLevel}</span>
                                            </li>
                                            <li>
                                                <a href="#">Posted Date</a>
                                                <span className="type-posts">{postedDate}</span>
                                            </li>
                                            <li>
                                                <a href="#">Company URL</a>
                                                <span className="type-posts">
                                                    <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">{job.companyWebsite}</a>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default JobDetails;