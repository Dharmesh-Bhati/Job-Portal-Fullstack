import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_JobSeeker || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const MyResume = () => {
    // State to store the fetched resume data
    const [resumeData, setResumeData] = useState(null);
    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the resume data from the backend
    useEffect(() => {
        const fetchResume = async () => {
            const token = localStorage.getItem('userToken');

            if (!token) {
                setError("You are not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/resume`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setResumeData(response.data);
                setLoading(false);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch resume:", err);
                if (err.response?.status === 404) {
                    setError("Your resume has not been created yet. Please create one first.");
                } else if (err.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                } else if (err.response?.status === 500) {
                    setError("An internal server error occurred. This is a backend issue. Please check your server-side logs.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    // Show loading state while data is being fetched
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-medium text-gray-700">Loading your resume...</div>
            </div>
        );
    }

    // Show error state if there's an error and no data
    if (error && !resumeData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 text-center text-red-500 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Destructure data for easier access
    const { userName, email, profilePictureUrl, professionTitle, bio, location, age, degree, fieldOfStudy, educationDescription, companyName, companyTitle, experienceDescription, skills } = resumeData || {};

    // Construct the final image URL, handling potential null/empty values
    const finalProfileImageUrl = profilePictureUrl ? `https://localhost:7203${profilePictureUrl}` : 'https://placehold.co/150x150/e2e8f0/64748b?text=JS';

    const userSkills = skills ? skills.split(/[;,\s]+/).filter(s => s) : [];

    return (
        <>
            {/* Page Header Section */}
            <div class="page-header" style={{ backgroundImage: 'url(/assets/img/banner1.jpg)' }}>
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="breadcrumb-wrapper">
                                <h2 class="product-title">My Resume</h2>
                                <ol class="breadcrumb">
                                    <li><a href="/Home/Index"><i class="ti-home"></i> Home</a></li>
                                    <li class="current">Resume</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                 

            {/* Main Content Section */}
            <section id="content">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="right-sideabr">
                                <div class="inner-box">
                                    <h4>Manage Account</h4>
                                    <ul class="lest item">
                                        <li><a class="active" href="/JobSeeker/MyResume">My Resume</a></li>
                                        <li><a href="/ManageApplication/MyApplication">My Application</a></li>
                                    </ul>
                                    <ul class="lest">
                                        <li><a href="#">Change Password</a></li>
                                        <li><a href="#">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="col-md-8 col-sm-8 col-xs-12">
                            <div className="inner-box my-resume">
                                <div className="author-resume">
                                    <div className="thumb">
                                        <img src={finalProfileImageUrl} alt="Profile Picture" />
                                    </div>
                                    <div className="author-info">
                                        <h3>{userName || "N/A"}</h3>
                                        <p className="sub-title">{professionTitle || "Profession Title Not Set"}</p>
                                        <ul className="list-unstyled contact-details">
                                            <li>
                                                <i className="ti-email"></i>
                                                <span>Email: {email || "N/A"}</span>
                                            </li>
                                            <li>
                                                <i className="ti-location-pin"></i>
                                                <span>Location: {location || "N/A"}</span>
                                            </li>
                                            <li>
                                                <i className="ti-calendar"></i>
                                                <span>Age: {age || "N/A"}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <hr />

                                {bio && (
                                    <>
                                        <div className="about-me item">
                                            <h3><i className="ti-user"></i> About Me</h3>
                                            <p>{bio}</p>
                                        </div>
                                        <hr />
                                    </>
                                )}

                                <div className="about-me item">
                                    <h3><i className="ti-bolt"></i> Skills</h3>
                                    {userSkills.length > 0 ? (
                                        <div className="skills-tags">
                                            {userSkills.map((skill, index) => (
                                                <span key={index} className="badge">{skill}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No skills added yet.</p>
                                    )}
                                </div>

                                <hr />

                                <div className="work-experience item">
                                    <h3><i className="ti-briefcase"></i> Work Experience</h3>
                                    <div className="experience-item">
                                        <h4>Company Name: {companyName || "N/A"}</h4>
                                        <h5>Company Title: {companyTitle || "N/A"}</h5>
                                        <p>Description: {experienceDescription || "No experience description provided."}</p>
                                    </div>
                                </div>

                                <hr />

                                <div className="education item">
                                    <h3><i className="ti-book"></i> Education</h3>
                                    <div className="education-item">
                                        <h4>Degree: {degree || "N/A"}</h4>
                                        <p className="sub-title">Field of Study: {fieldOfStudy || "N/A"}</p>
                                        <p>Description: {educationDescription || "No education description provided."}</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/JobSeeker/AddJobSeekerDetails" className="btn btn-common mt-2">Edit</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyResume;

 