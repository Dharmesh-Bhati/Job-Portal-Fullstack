import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_Job || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    // Manually handle authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isJobSeeker, setIsJobSeeker] = useState(false);

    useEffect(() => {
        // Function to parse the token and set auth state
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

        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/all`);
                setJobs(response.data.jobCards);
                setFilteredJobs(response.data.jobCards);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
        fetchJobs();
    }, []);

    // This code goes inside your AllJobs.js component

    const handleSearch = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();

        const filtered = jobs.filter(job => {
            // Create an array of all searchable string properties from the job object.
            const searchableFields = [
                job.jobTitle,
                job.companyName,
                job.jobCategory,
                job.location,
                job.jobDescription,
                job.skills
            ];

            // Check if any of these fields include the search term.
            return searchableFields.some(field =>
                field && field.toLowerCase().includes(lowercasedSearchTerm)
            );
        });

        setFilteredJobs(filtered);
        setCurrentPage(1); // Reset to the first page on a new search.
    };

    // Calculate jobs to display for the current page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredJobs.length / jobsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleApply = async (jobId) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("You need to log in to apply for a job.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/apply/${jobId}`, {}, {
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
        return <div className="text-center mt-5">Loading jobs...</div>;
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header" style={{ background: 'url(/assets/img/banner1.jpg) no-repeat center center', backgroundSize: 'cover', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">Find Job</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Find Job</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Find Job Section */}
            <section className="find-job section">
                <div className="container">
                    <h2 className="section-title">Find a good Job</h2>
                    <div className="row">
                        {/* Search Bar */}
                        <div className="col-md-12 mb-4 d-flex justify-content-end">
                            <div className="input-group" style={{ width: '300px'  }}>
                                <input
                                    type="text"
                                    id="searchInput"
                                    className="form-control"
                                    placeholder="Search by title, location, etc."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                />
                                <div className="input-group-append">
                                    <button
                                        id="searchButton"
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {currentJobs.length > 0 ? (
                                <div id="job-listings">
                                    {currentJobs.map((job) => (
                                        <div className="job-list" key={job.jobId}>
                                            <div className="thumb">
                                                <Link to={`/job-detail/${job.jobId}`}>
                                                    <img src={`https://localhost:7203/${job.companyLogoUrl}`} alt={job.jobTitle} style={{ maxWidth: '100px' }} />
                                                </Link>
                                            </div>
                                            <div className="job-list-content">
                                                <h4>
                                                    <Link to={`/job-detail/${job.jobId}`}>{job.jobTitle}</Link>
                                                    <span className="full-time">{job.jobType}</span>
                                                </h4>
                                                <p>{job.jobDescription}</p>
                                                <Link to={`/job-detail/${job.jobId}`} className="btn btn-common btn-sm">JOB DETAILS...</Link>
                                                <div className="job-tag">
                                                    <div className="pull-left">
                                                        <div className="meta-tag">
                                                            <span><i className="ti-brush"></i>{job.jobCategory}</span>
                                                            <span><i className="ti-location-pin"></i>{job.companyAddress}, {job.city}, {job.region}, {job.country}</span>
                                                            <span><i className="ti-time"></i>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="pull-right">
                                                        <div className="icon">
                                                            <i className="ti-heart"></i>
                                                        </div>
                                                        {isAuthenticated && isJobSeeker && (
                                                            <button
                                                                onClick={() => handleApply(job.jobId)}
                                                                className="btn btn-common btn-rm"
                                                            >
                                                                Apply Job
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p>No jobs available at the moment.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="col-md-12 mt-4 d-flex justify-content-center">
                            <ul className="pagination">
                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <a onClick={() => paginate(number)} className="page-link" style={{ cursor: 'pointer' }}>
                                            {number}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AllJobs;
