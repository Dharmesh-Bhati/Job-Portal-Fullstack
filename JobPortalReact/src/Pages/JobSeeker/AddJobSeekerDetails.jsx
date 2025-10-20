import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_JobSeeker || 'FALLBACK_URL_IF_ENV_IS_MISSING';


function AddJobSeekerDetails() {

     const [formData, setFormData] = useState({
        username: '',
        email: '',
        professionTitle: '',
        bio: '',
        location: '',
        age: '',
        degree: '',
        fieldOfStudy: '',
        educationDescription: '',
        companyName: '',
        companyTitle: '',
        experienceDescription: '',
        skills: '',
    });

    const navigate = useNavigate();

     const [profileImage, setProfileImage] = useState(null);
    const [profileImageName, setProfileImageName] = useState('Picture was not selected');

     const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageLoading, setPageLoading] = useState(true); // New state for initial page load

     useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('userToken'); // Assuming token is stored in localStorage

            if (!token) {
                setError("You are not authenticated. Please login again.");
                setPageLoading(false);
                return;
            }

            try {
                // GET request to fetch user details from backend
                const response = await axios.get(
                    `${API_BASE_URL}/details`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                // Update the form state with fetched data
                const userDetails = response.data;
                setFormData(prevData => ({
                    ...prevData,
                    username: userDetails.userName || '',
                    email: userDetails.email || '',
                     professionTitle: userDetails.professionTitle || '',
                    bio: userDetails.bio || '',
                    profileImage: userDetails.profileImageUrl || '',
                    location: userDetails.location || '',
                    age: userDetails.age || '',
                    degree: userDetails.degree || '',
                    fieldOfStudy: userDetails.fieldOfStudy || '',
                    educationDescription: userDetails.educationDescription || '',
                    companyName: userDetails.companyName || '',
                    companyTitle: userDetails.companyTitle || '',
                    experienceDescription: userDetails.experienceDescription || '',
                    skills: userDetails.skills || '',
                }));

            } catch (err) {
                console.error("Error in Fetching user data:", err);
                setError('Can not load user information.');
            } finally {
                setPageLoading(false);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array means this runs only once on mount

     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

     const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImageName(file.name);
        } else {
            setProfileImage(null);
            setProfileImageName('Picture was not selected');
        }
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataObject = new FormData();

         formDataObject.append('ProfessionTitle', formData.professionTitle);
        formDataObject.append('Bio', formData.bio);
        formDataObject.append('Location', formData.location);
        formDataObject.append('Age', formData.age);
        formDataObject.append('Degree', formData.degree);
        formDataObject.append('FieldOfStudy', formData.fieldOfStudy);
        formDataObject.append('EducationDescription', formData.educationDescription);
        formDataObject.append('CompanyName', formData.companyName);
        formDataObject.append('CompanyTitle', formData.companyTitle);
        formDataObject.append('ExperienceDescription', formData.experienceDescription);
        formDataObject.append('Skills', formData.skills);

         
        if (profileImage) {
            formDataObject.append('ProfileImage', profileImage);
        }  


        const token = localStorage.getItem('userToken');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/details`,
                formDataObject,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                         
                        'Content-Type': 'multipart/form-data' 
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Success:", response.data);
                alert('Job seeker details successfully updated!');
                 navigate('/JobSeeker/MyResume');
            } else {
                setError('Details not submitted. Please try again.');
            }
        } catch (err) {
            console.error("Error in submission:", err);
            if (err.response) {
                setError(err.response.data.message || 'There is an error. Please try again.');
            } else {
                setError('Network error. Server cannot be reached.');
            }
        } finally {
            setLoading(false);
        }
    };

     
    if (pageLoading) {
        return <div>Loading user details...</div>;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

  
    return (
        <>
            {/* ... (Header and other JSX) ... */}
            <section id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 col-md-offset-2">
                            <div className="page-ads box">
                                <form onSubmit={handleSubmit} >
                                    <div className="divider"><h3>Basic information</h3></div>

                                    {/* Prefilled and read-only fields */}
                                    <div className="form-group">
                                        <label className="control-label">Name</label>
                                        <input type="text" className="form-control" value={formData.username} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Email</label>
                                        <input type="text" className="form-control" value={formData.email} readOnly />
                                    </div>

                                    {/* Other input fields */}
                                    <div className="form-group">
                                        <label className="control-label">Profession Title</label>
                                        <input name="professionTitle" type="text" className="form-control" placeholder="Headline (e.g. Front-end developer)" value={formData.professionTitle} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Bio</label>
                                        <textarea name="bio" className="form-control" rows="7" value={formData.bio} onChange={handleInputChange}></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Location</label>
                                        <input name="location" type="text" className="form-control" placeholder="Location, e.g. New York" value={formData.location} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Age</label>
                                        <input name="age" type="number" className="form-control" placeholder="Years old" value={formData.age} onChange={handleInputChange} />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label">Upload Profile Picture</label>
                                        <div className="button-group">
                                            <div className="action-buttons">
                                                <div className="upload-button">
                                                    {/*<button type="button" className="btn btn-common">Choose a picture</button>*/}
                                                    <input name="profileImage" type="file" onChange={handleFileChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divider"><h3>Education</h3></div>
                                    <div className="form-group">
                                        <label className="control-label">Degree</label>
                                        <input name="degree" type="text" className="form-control" placeholder="Degree, e.g. Bachelor" value={formData.degree} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Field Of Study</label>
                                        <input name="fieldOfStudy" type="text" className="form-control" placeholder="Major, e.g Computer Science" value={formData.fieldOfStudy} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Education Description</label>
                                        <textarea name="educationDescription" className="form-control" rows="7" value={formData.educationDescription} onChange={handleInputChange}></textarea>
                                    </div>

                                    <div className="divider"><h3>Work Experience</h3></div>
                                    <div className="form-group">
                                        <label className="control-label">Company Name</label>
                                        <input name="companyName" type="text" className="form-control" placeholder="Company name" value={formData.companyName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Company Title</label>
                                        <input name="companyTitle" type="text" className="form-control" placeholder="e.g UI/UX Researcher" value={formData.companyTitle} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Experience Description</label>
                                        <textarea name="experienceDescription" className="form-control" rows="7" placeholder="Enter your experience here..." value={formData.experienceDescription} onChange={handleInputChange}></textarea>
                                    </div>

                                    <div className="divider"><h3>Skills</h3></div>
                                    <div className="form-group">
                                        <label className="control-label">Skills</label>
                                        <input name="skills" className="form-control" placeholder="e.g. C#, ASP.NET Core, SQL" type="text" value={formData.skills} onChange={handleInputChange} />
                                    </div>

                                    {error && <div className="text-danger">{error}</div>}

                                    <button type="submit" className="btn btn-common" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Update'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddJobSeekerDetails;