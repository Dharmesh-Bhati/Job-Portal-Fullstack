import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

// --- Utility Functions ---

 const getJobTypeClass = (jobType) => {
    if (!jobType) return '';
     return jobType.toLowerCase().replace(/\s/g, '-');
};

const defaultLogo = '/assets/img/default-logo.png';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'FALLBACK_URL_IF_ENV_IS_MISSING';

// --- Main SearchResult Component ---

const SearchResult = () => {
     const [jobCards, setJobCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
     const isJobSeeker = true; // Temporary Placeholder

    const keywords = searchParams.get('keywords') || '';
    const city = searchParams.get('city') || '';
    const category = searchParams.get('category') || '';

    // Route path for job details (based on your router config)
    const getJobDetailsPath = (jobId) => `/job-detail/${jobId}`;

    // --- API & Data Fetching ---

    const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);

        try {
            // API call: /api/Job/search?keywords=...&city=...&category=...
            const response = await axios.get(`${API_BASE_URL}/Job/search`, {
                params: { keywords, city, category }
            });

             if (response.data && response.data.jobCards) {
                setJobCards(response.data.jobCards);
            } else {
                setJobCards([]);
            }
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError("Failed to load search results. Please check the API connection.");
            setJobCards([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Apply Job Handler ---

    const handleApplyJob = async (jobId) => {
        if (!isJobSeeker) {
            alert("????? ????? ???? ?? ??? Job Seeker ?? ??? ??? ??? ?? ?????");
            return;
        }

          const token = localStorage.getItem('authToken'); 

        try {
            // API call: POST /api/Job/apply/{jobId}
            await axios.post(`${API_BASE_URL}/Job/apply/${jobId}`, null, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            alert("your application submit successfully");
        } catch (err) {
            console.error("Error applying for job:", err.response?.data || err.message);
            alert(`Application failed: ${err.response?.data?.message || "Server error"}`);
        }
    };


    useEffect(() => {
        fetchSearchResults();
    }, [keywords, city, category]); 


    // --- JSX Rendering (View) ---

    if (loading) {
        return (
            <section className="job-list-container section">
                <div className="container text-center">
                    <h2 className="section-title">Search Results</h2>
                    <p>Loading search results...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="job-list-container section">
                <div className="container text-center">
                    <h2 className="section-title text-danger">Search Error</h2>
                    <p className="text-danger">{error}</p>
                </div>
            </section>
        );
    }

    // Check if results are empty
    const hasResults = jobCards.length > 0;

    return (
        <section className="job-list-container section">
            <div className="container">
                <h2 className="section-title text-center">Search Results</h2>
                <div className="row">

                    {hasResults ? (
                        jobCards.map((job) => (
                            <div className="col-md-12" key={job.jobId}>
                                <div className="job-list">
                                    <div className="thumb">
                                        {/* Logo Link */}
                                        <Link to={getJobDetailsPath(job.jobId)}>
                                            <img
                                                src={`https://localhost:7203/${job.companyLogoUrl}`}
                                                alt="Company Logo"
                                            />
                                        </Link>
                                    </div>
                                    <div className="job-list-content">
                                        <h4>
                                            {/* Title Link */}
                                            <Link to={getJobDetailsPath(job.jobId)}>{job.jobTitle}</Link>
                                            <span className={getJobTypeClass(job.jobType)}>{job.jobType}</span>
                                        </h4>
                                        <p>
                                            {/* Job Description Truncation */}
                                            {job.jobDescription && job.jobDescription.length > 150
                                                ? `${job.jobDescription.substring(0, 150)}...`
                                                : job.jobDescription || ''
                                            }
                                        </p>

                                        {/* JOB DETAILS Button */}
                                        <Link to={getJobDetailsPath(job.jobId)} className="btn btn-common btn-sm">
                                            JOB DETAILS...
                                        </Link>

                                        <div className="job-tag">
                                            <div className="pull-left">
                                                <div className="meta-tag">
                                                    <span>
                                                        <i className="ti-brush"></i>{job.jobCategory}
                                                    </span>
                                                    <span>
                                                        <i className="ti-location-pin"></i>{job.city}, {job.region}
                                                    </span>
                                                </div>
                                            </div>
                                        {/*    <div className="pull-right">*/}
                                        {/*        */}{/* Apply Job Button (Conditional rendering based on isJobSeeker) */}
                                        {/*        {isJobSeeker && (*/}
                                        {/*            <button*/}
                                        {/*                type="button"*/}
                                        {/*                onClick={() => handleApplyJob(job.jobId)}*/}
                                        {/*                className="btn btn-common btn-rm"*/}
                                        {/*            >*/}
                                        {/*                Apply Job*/}
                                        {/*            </button>*/}
                                        {/*        )}*/}
                                        {/*    </div>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // No Results Message
                        <div className="col-md-12 text-center">
                            <h3 className="no-results-message">Sorry, no jobs found matching your criteria.</h3>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SearchResult;