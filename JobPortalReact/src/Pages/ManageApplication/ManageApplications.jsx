import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
  
const API_URL = import.meta.env.VITE_API_BASE_URL_ManageApplication || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ManageApplications.jsx

    useEffect(() => {
        const fetchApplications = async () => {
             const token = localStorage.getItem('userToken');  

            if (!token) {
                setError("Authentication token missing. Please log in again.");
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                     
                    'Authorization': `Bearer ${token}`
                }
            };

            try {
                const response = await axios.get(`${API_URL}/recruiter/applications`, config);

                 if (Array.isArray(response.data)) {
                    setApplications(response.data);
                } else {
                    setApplications([]);
                }
                setLoading(false);
            } catch (err) {
                 if (axios.isAxiosError(err)) {
                    if (err.response && (err.response.status === 404 || err.response.status === 401)) {
                         setApplications([]);
                         if (err.response.status === 401) {
                            setError("Unauthorized access. Please ensure you are logged in as a Recruiter.");
                        } else {
                            setError(null); 
                        }
                    } else {
                        console.error("Error fetching applications:", err);
                        setError("Failed to load applications due to a server or network error.");
                    }
                }
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // ------------------------------------------------
    // JSX Rendering Logic
    // ------------------------------------------------

    if (loading) {
        return <div className="text-center mt-5">Loading applications...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    const hasApplications = applications && applications.length > 0;

    return (
        <>
            {/* Header / Breadcrumb Section (Direct Razor View Conversion) */}
            <div
                className="page-header"
                style={{
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
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">Manage Applications</h2>
                                <ol className="breadcrumb">
                                    <li><a href="/"><i className="ti-home"></i> Home</a></li>
                                    <li className="current">Manage Applications</li>
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
                        {/* Sidebar (Navigation) */}
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

                        {/* Main Applications List */}
                        <div className="col-md-9">
                            <div className="job-alerts-item">
                                <h3 className="alerts-title">All Applications</h3>

                                {/* @if (!Model.Any()) equivalent */}
                                {!hasApplications ? (
                                    <div className="alert alert-info text-center" role="alert">
                                        <p>No job applications received yet.</p>
                                    </div>
                                ) : (
                                    <table id="myApplicationsTable" className="table table-striped table-bordered table-hover" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Applicant & Job Title</th>
                                                <th>Profession</th>
                                                <th>Applied Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* @foreach (var application in Model) equivalent */}
                                            {/* Array.isArray(applications) check is crucial to prevent the error you faced */}
                                                {Array.isArray(applications) && applications.map((application) => {
                                                     
                                                     
                                                    // Date Formatting 
                                                    const appliedDate = application.appliedDate ? new Date(application.appliedDate) : null;
                                                    const formattedDate = appliedDate
                                                        ? appliedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                                                        : 'N/A';

                                                    const viewDetailsUrl = `/ManageApplication/ViewSeekerApplication/${application.id}`;

                                                    return (
                                                        <tr key={application.Id}>
                                                            <td>
                                                                <div className="thums col-md-3">
                                                                    <img src={`https://localhost:7203/${application.profilePicture}`} alt="Applicant" />
                                                                </div>
                                                                <h3>{application.applicantName || 'N/A'}</h3>
                                                                <span>{application.jobTitle || 'N/A'}</span>
                                                            </td>
                                                            <td>{application.professionTitle || 'N/A'}</td>
                                                            <td>{formattedDate}</td>
                                                            <td>{application.status}</td>
                                                            <td>
                                                                <a href={viewDetailsUrl} className="btn btn-sm btn-common">View Details</a>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
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

export default ManageApplications;