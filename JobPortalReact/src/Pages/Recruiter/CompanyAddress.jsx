import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'FALLBACK_URL_IF_ENV_IS_MISSING';

const CompanyAddress = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        recruiterUsername: '',
        recruiterEmail: '',
        companyName: '',
        companyWebsite: '',
        companyDescription: '',
        address: '',
        city: '',
        region: '',
        phone: '',
        zipCode: '',
        country: '',
        companyLogoFile: null,
        existingCompanyLogoPath: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/Recruiter/company`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Set form data with fetched values
                setFormData(prev => ({
                    ...prev,
                    recruiterUsername: response.data.recruiterUsername,
                    recruiterEmail: response.data.recruiterEmail,
                    companyName: response.data.companyName,
                    companyWebsite: response.data.companyWebsite,
                    companyDescription: response.data.companyDescription,
                    address: response.data.address,
                    city: response.data.city,
                    region: response.data.region,
                    phone: response.data.phone,
                    zipCode: response.data.zipCode,
                    country: response.data.country,
                    existingCompanyLogoPath: response.data.existingCompanyLogoPath // Logo path
                }));
                setIsUpdate(true);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch company details:", err);
                if (err.response?.status === 404) {
                    setIsUpdate(false); // No existing data, so it's a new registration
                    setError("No company data found. Please register your company.");
                    // Fetch recruiter info from a different endpoint if needed
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'companyLogoFile' && files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
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

        const dataToSend = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) {
                dataToSend.append(key, formData[key]);
            }
        }

        try {
            await axios.post(`${API_BASE_URL}/Recruiter/company`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Required for file uploads
                }
            });

            alert(`Company profile ${isUpdate ? 'updated' : 'registered'} successfully!`);
            navigate('/Job/PostJob'); // Redirect to a success page

        } catch (err) {
            console.error("Submission failed:", err.response || err);
            setError("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading company data...</div>;
    }

    return (
        <>
            <div className="page-header" style={{ background: 'url(/assets/img/banner1.jpg) no-repeat center center', backgroundSize: 'cover', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="breadcrumb-wrapper">
                                <h2 className="product-title">Register Company</h2>
                                <ol className="breadcrumb">
                                    <li><a href="#"><i className="ti-home"></i> Home</a></li>
                                    <li className="current">Register Company</li>
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
                                    {error && <div className="text-danger mb-3">{error}</div>}
                                    <div className="divider"><h3>Recruiter Information</h3></div>
                                    <div className="form-group">
                                        <label className="control-label">Your Username</label>
                                        <input className="form-control" name="recruiterUsername" value={formData.recruiterUsername} onChange={handleChange} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Your Email</label>
                                        <input className="form-control" name="recruiterEmail" value={formData.recruiterEmail} onChange={handleChange} readOnly />
                                    </div>

                                    <div className="divider"><h3>Company Details</h3></div>
                                    <div className="form-group">
                                        <label className="control-label">Company Name <span className="required">*</span></label>
                                        <input className="form-control" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter the name of the company" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Company Website <span>(optional)</span></label>
                                        <input className="form-control" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="http://" />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Company Description <span>(optional)</span></label>
                                        <textarea className="form-control" name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="5"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Address <span className="required">*</span></label>
                                        <input className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <label className="control-label">City <span className="required">*</span></label>
                                                <input className="form-control" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="control-label">Region <span className="required">*</span></label>
                                                <input className="form-control" name="region" value={formData.region} onChange={handleChange} placeholder="Region/State" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <label className="control-label">Phone <span className="required">*</span></label>
                                                <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="control-label">Zip Code <span className="required">*</span></label>
                                                <input className="form-control" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Country <span className="required">*</span></label>
                                        <input className="form-control" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Company Logo <span>(optional)</span></label>
                                        {formData.existingCompanyLogoPath && (
                                            <div className="mb-3">
                                                <img src={`https://localhost:7203/${formData.existingCompanyLogoPath}`} alt="Company Logo" style={{ maxWidth: '150px', height: 'auto' }} />
                                            </div>
                                        )}
                                        <input type="file" name="companyLogoFile" onChange={handleChange} className="form-control" />
                                    </div>
                                    <button type="submit" className="btn btn-common" disabled={submitting}>
                                        {submitting ? 'Submitting...' : isUpdate ? 'Update Company Details' : 'Register your Company'}
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

export default CompanyAddress;