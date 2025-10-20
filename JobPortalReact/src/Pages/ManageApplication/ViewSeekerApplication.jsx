import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL_ManageApplication || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const ViewSeekerApplication = () => {
     const { id } = useParams();

    // State for data, loading status, and errors
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Logic ---
    useEffect(() => {
        const fetchDetails = async () => {
            const token = localStorage.getItem('userToken'); 

            if (!token || !id) {
                setError("Authentication token or application ID missing.");
                setLoading(false);
                return;
            }

            const API_URL = `${BASE_API_URL}/recruiter/application/${id}`;

            try {
                const response = await axios.get(API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                 setApplication(response.data);
            } catch (err) {
                console.error("Error fetching application details:", err);
                if (err.response && err.response.status === 404) {
                    setError("Application not found or you do not have permission to view it.");
                } else {
                    setError("Failed to load application details. Please check the network connection.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]); // Rerun effect when ID changes

    // --- Status Update Handler ---
    const updateStatus = async (newStatus) => {
        const token = localStorage.getItem('userToken');
        if (!token || !id) return;

        setLoading(true); // Disable buttons while updating

        try {
            // PUT request to the UpdateStatus endpoint
            await axios.put(
                `${BASE_API_URL}/recruiter/application/${id}/status`,
                JSON.stringify(newStatus), // Send the status string in the body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update the local state instantly on success
            setApplication(prev => ({ ...prev, status: newStatus }));
            alert(`Application status successfully updated to ${newStatus}.`);

        } catch (err) {
            console.error(`Error updating status to ${newStatus}:`, err.response || err);
            alert(`Failed to update status to ${newStatus}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    // --- Rendering Logic ---
    if (loading) return <div className="text-center mt-5 p-5">Loading application details...</div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
    if (!application) return <div className="alert alert-warning text-center mt-5">No application data available.</div>;

    // Data Transformations for JSX Rendering
    const appliedDate = application.appliedDate
        ? new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : 'N/A';

     const defaultImageUrl = '/assets/img/jobs/default-applicant.png';
     const imageUrl = application.profilePicture
        ? `${BASE_API_URL}/${application.profilePicture.startsWith('/') ? application.profilePicture.substring(1) : application.profilePicture}` // Prepends base URL
        : defaultImageUrl;

     const skillsArray = application.skills
        ? application.skills.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
        : [];

    return (
        <>
            {/* Header / Breadcrumb Section */}
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
                                <h2 className="product-title">Application Details</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Application Details</li>
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

                        <div className="col-md-3 col-sm-4 col-xs-12">
                            <div className="right-sideabr">
                                <div className="inner-box">
                                    <h4>Manage Account</h4>
                                    <ul className="lest item">
                                        <li><a href="/Job/ManageJobs">Manage Jobs</a></li>
                                        <li><a className="active" href="/ManageApplication/ManageApplications">Manage Applications</a></li>
                                    </ul>
                                    <ul className="lest">
                                        <li><a href="/Account/ForgotPassword">Change Password</a></li>
                                        <li><a href="index-2.html">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9">
                            <div className="job-alerts-item">
                                {/* Use camelCase: application.jobTitle */}
                                <h3 className="alerts-title">Application for {application.jobTitle || 'N/A'}</h3>
                                <hr />

                                <div className="row">
                                    {/* Left Column: Profile Info */}
                                    <div className="col-lg-4 col-md-5">
                                        <div className="candidate-item-widget">
                                            <div className="profile-info-container">
                                                <div className="candidate-photo">
                                                    <img src={imageUrl} alt="Applicant's Profile Picture" />
                                                </div>
                                                <div className="candidate-details">
                                                     <h3 className="name">{application.applicantUserName || 'N/A'}</h3>
                                                    <p className="sub-name">{application.professionTitle || 'N/A'}</p>
                                                    <p className="sub-name">{application.applicantEmail || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Details & Actions */}
                                    <div className="col-lg-8 col-md-7">
                                        {/* About Candidate */}
                                        <div className="about-candidate-widget widget">
                                            <h3 className="widget-title">About the Candidate</h3>
                                            <div className="job-description">
                                                <p><strong>Location:</strong> {application.location || 'N/A'}</p>
                                                <p><strong>Applied Date:</strong> {appliedDate}</p>
                                                <p><strong>Current Status:</strong> {application.status}</p>

                                                <p><strong>Bio:</strong> {application.bio || 'No bio provided.'}</p>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="skills-widget widget">
                                            <h3 className="widget-title">Skills</h3>
                                            <div className="tag-box">
                                                {skillsArray.length > 0 ? (
                                                    skillsArray.map((skill, index) => (
                                                        <span key={index} className="tag-item">{skill}</span>
                                                    ))
                                                ) : (
                                                    <p>No skills listed.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Education */}
                                        <div className="education-widget widget">
                                            <h3 className="widget-title">Education</h3>
                                            <div className="job-description">
                                                <p>{application.educationDescription || 'No education details provided.'}</p>
                                            </div>
                                        </div>

                                         <div className="action-buttons mt-4">
                                             {application.status !== "Approved" && (
                                                <button
                                                    onClick={() => updateStatus("Approved")}
                                                    className="btn btn-success"
                                                    disabled={loading} // Disable during API call
                                                >
                                                    Approve
                                                </button>
                                            )}

                                            {/* Reject Button */}
                                            {application.status !== "Rejected" && (
                                                <button
                                                    onClick={() => updateStatus("Rejected")}
                                                    className="btn btn-danger ml-2"  
                                                    disabled={loading} // Disable during API call
                                                >
                                                    Reject
                                                </button>
                                            )}

                                             
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewSeekerApplication;