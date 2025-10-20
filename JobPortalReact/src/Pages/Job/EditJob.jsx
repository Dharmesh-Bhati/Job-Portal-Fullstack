import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_Job || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jobId: id,
        jobTitle: '',
        jobType: '',
        jobCategoryId: '',
        experience: '',
        vacancy: '',
        location: '',
        skills: '',
        description: '',
        postedDate: ''
    });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobData = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/edit/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const jobData = response.data;

                // Pre-populate form with fetched data
                setFormData({
                    jobId: jobData.jobId,
                    jobTitle: jobData.jobTitle,
                    jobType: jobData.jobType,
                    jobCategoryId: jobData.jobCategoryId,
                    experience: jobData.experience,
                    vacancy: jobData.vacancy,
                    location: jobData.location,
                    skills: jobData.skills,
                    description: jobData.description,
                    postedDate: jobData.postedDate ? new Date(jobData.postedDate).toISOString().split('T')[0] : ''
                });

                // Set available categories for the dropdown
                setAvailableCategories(jobData.availableCategories || []);
            } catch (err) {
                console.error("Failed to fetch job data:", err);
                setError("Failed to load job details. Please check the URL or try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('userToken');

        // Create a new object with only the data to be sent for update
        const dataToSend = {
            jobId: formData.jobId,
            jobTitle: formData.jobTitle,
            jobType: formData.jobType,
            jobCategoryId: formData.jobCategoryId,
            experience: formData.experience,
            vacancy: formData.vacancy,
            location: formData.location,
            skills: formData.skills,
            description: formData.description,
            postedDate: formData.postedDate
        };

        try {
            await axios.put(`https://localhost:7203/api/job/update`, dataToSend, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Job updated successfully!');
            navigate('/Job/ManageJobs');
        } catch (err) {
            console.error("Failed to update job:", err);
            setError("Failed to update the job. Please check the form data and try again.");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    // Check if formData is populated
    if (!formData.jobTitle) {
        return <div className="text-center mt-5">No job data found.</div>;
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
                                <h2 className="product-title">Edit Job</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Edit Job</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-9 col-md-offset-2">
                            <div className="page-ads box">
                                <form onSubmit={handleSubmit} className="form-ad">
                                    <input type="hidden" name="jobId" value={formData.jobId} />

                                    <div className="divider"><h3>Job Details</h3></div>

                                    {/* Job Title */}
                                    <div className="form-group">
                                        <label htmlFor="jobTitle" className="control-label"><span className="required">JobTitle</span></label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            className="form-control"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Job Type */}
                                    <div className="form-group">
                                        <label htmlFor="jobType" className="control-label"><span className="required">JobType</span></label>
                                        <div className="search-category-container">
                                            <label className="styled-select">
                                                <select
                                                    name="jobType"
                                                    className="dropdown-product selectpicker"
                                                    value={formData.jobType}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Job Type</option>
                                                    <option value="Full-Time">Full-Time</option>
                                                    <option value="Part-Time">Part-Time</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Internship">Internship</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Job Category */}
                                    <div className="form-group">
                                        <label htmlFor="jobCategoryId" className="control-label"><span className="required">JobCategory</span></label>
                                        <div className="search-category-container">
                                            <label className="styled-select">
                                                <select
                                                    name="jobCategoryId"
                                                    className="dropdown-product selectpicker"
                                                    value={formData.jobCategoryId}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Job Category</option>
                                                    {availableCategories.map(category => (
                                                        <option key={category.value} value={category.value}>
                                                            {category.text}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="form-group">
                                        <label htmlFor="experience" className="control-label"><span className="required">Experience</span></label>
                                        <div className="search-category-container">
                                            <label className="styled-select">
                                                <select   
                                                    name="experience"
                                                    className="dropdown-product selectpicker"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Experience Level</option>
                                                    <option value="Fresher">Fresher</option>
                                                    <option value="1-3 years">1-3 years</option>
                                                    <option value="3-5 years">3-5 years</option>
                                                    <option value="5+ years">5+ years</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Vacancy */}
                                    <div className="form-group">
                                        <label htmlFor="vacancy" className="control-label"><span className="required">Vacancy</span></label>
                                        <input
                                            type="number"
                                            name="vacancy"
                                            className="form-control"
                                            value={formData.vacancy}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="form-group">
                                        <label htmlFor="location" className="control-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Skills */}
                                    <div className="form-group">
                                        <label htmlFor="skills" className="control-label">Skills</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            className="form-control"
                                            value={formData.skills}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="form-group">
                                        <label htmlFor="description" className="control-label">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="5"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    {/* Posted Date */}
                                    <div className="form-group">
                                        <label htmlFor="postedDate" className="control-label">Posted Date</label>
                                        <input
                                            type="date"
                                            name="postedDate"
                                            className="form-control"
                                            value={formData.postedDate}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-common">Update Job</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EditJob;