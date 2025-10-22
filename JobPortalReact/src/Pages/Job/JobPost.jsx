import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_Job || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobType: '',
        jobCategoryId: '',
        experience: '',
        vacancy: '',
        location: '',
        skills: '',
        description: '',
        postedDate: new Date().toISOString().slice(0, 10), // Sets default to today's date
    });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const fetchJobCategories = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }
            try {
                
                const response = await axios.get(`${API_BASE_URL}/post`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAvailableCategories(response.data.availableCategories);
            } catch (err) {
                console.error("Failed to fetch job categories:", err);
                setError("Failed to load job categories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const token = localStorage.getItem('userToken');
        if (!token) {
            setSubmitting(false);
            setError("Authentication token not found. Please log in again.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/post`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Job posted successfully!');
            navigate('/Job/AllJobs'); // Redirect to a dashboard or a success page
        } catch (err) {
            console.error("Failed to post job:", err.response || err);
            setError("Failed to post job. Please check your data and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading job form...</div>;
    }

    return (
        <>
             
            <div className="page-header" style={{ background: 'url(/assets/img/banner1.jpg) no-repeat center center', backgroundSize: 'cover', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">Post A Job</h2>
                                <ol className="breadcrumb">
                                    <li><Link to="/"><i className="ti-home"></i> Home</Link></li>
                                    <li className="current">Post A Job</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <section id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-9 col-md-offset-2">
                            <div className="page-ads box">
                                <form className="form-ad" onSubmit={handleSubmit}>
                                    <div className="divider"><h3>Job Details</h3></div>
                                    {error && <div className="alert alert-danger">{error}</div>}

                                     
                                    <div className="form-group">
                                        <label className="control-label"><span>Job Title</span></label>
                                        <input className="form-control" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                                    </div>

                                   
                                    <div className="form-group">
                                        <label className="control-label"><span>Job Type</span></label>
                                        <div className="search-category-container">
                                            <select className="dropdown-product selectpicker form-control" name="jobType" value={formData.jobType} onChange={handleChange} required>
                                                <option value="">Select Job Type</option>
                                                <option value="Full-Time">Full-Time</option>
                                                <option value="Part-Time">Part-Time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>
                                    </div>

                                   
                                    <div className="form-group">
                                        <label className="control-label"><span>Job Category</span></label>
                                        <div className="search-category-container">
                                            <select className="dropdown-product selectpicker form-control" name="jobCategoryId" value={formData.jobCategoryId} onChange={handleChange} required>
                                                <option value="">Select Job Category</option>
                                                {availableCategories.map((category) => (
                                                    <option key={category.value} value={category.value}>
                                                        {category.text}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                  
                                    <div className="form-group">
                                        <label className="control-label"><span>Experience</span></label>
                                        <div className="search-category-container">
                                            <select className="dropdown-product selectpicker form-control" name="experience" value={formData.experience} onChange={handleChange} required>
                                                <option value="">Select Experience Level</option>
                                                <option value="Fresher">Fresher</option>
                                                <option value="1-3 years">1-3 years</option>
                                                <option value="3-5 years">3-5 years</option>
                                                <option value="5+ years">5+ years</option>
                                            </select>
                                        </div>
                                    </div>
 
                                    <div className="form-group">
                                        <label className="control-label"><span>Vacancy</span></label>
                                        <input type="number" name="vacancy" value={formData.vacancy} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label"><span>Location</span></label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label"><span>Skills</span></label>
                                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label"><span>Description</span></label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="5"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label"><span>Posted Date</span></label>
                                        <input type="date" name="postedDate" value={formData.postedDate} onChange={handleChange} className="form-control" />
                                    </div>

                                    <button type="submit" className="btn btn-common" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit your job'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PostJob;