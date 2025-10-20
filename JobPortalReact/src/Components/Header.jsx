import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

     const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);  

    // States for Mobile/Hamburger Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      
    // States for dropdown visibility (Desktop Hover & Mobile Click)
    const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
    const [isCandidatesDropdownOpen, setIsCandidatesDropdownOpen] = useState(false);
    const [isEmployersDropdownOpen, setIsEmployersDropdownOpen] = useState(false);
    const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);

     const [activeMobileDropdown, setActiveMobileDropdown] = useState(null); 

    useEffect(() => {
        const token = localStorage.getItem('userToken');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                 const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                setIsLoggedIn(true);
                setUserRole(role);
            } catch (error) {
                console.error("Invalid token:", error);
                handleLogout();
            }
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
        }
        
         setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/login');
    };

    // Common function to handle hover events (Desktop)
    const handleMouseEnter = (setter) => setter(true);
    const handleMouseLeave = (setter) => setter(false);

    //   Main Menu Toggle (Hamburger Button)
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => {
             if (prev) {
                setActiveMobileDropdown(null);
            }
            return !prev;
        });
    };
    
    //  Dropdown Toggle Handler (Mobile Click)
    const handleDropdownClick = (dropdownName, desktopSetter) => {
         if (window.innerWidth >= 768) return; 

         setActiveMobileDropdown(prev => prev === dropdownName ? null : dropdownName);

         desktopSetter(prev => !prev);
    };

    // Function to check and set active class for links
    const getActiveClass = (path) => {
         if (path === '/') return location.pathname === path ? 'active' : '';
         return location.pathname.toLowerCase().includes(path.toLowerCase()) ? 'active' : '';
    };

    // Function to check if a main dropdown link should be "active" (Dropdown-level highlight)
    const isDropdownActive = (paths) => {
        return paths.some(path => location.pathname.toLowerCase().includes(path.toLowerCase())) ? 'active' : '';
    };

    // Dropdown 'open' state logic (Checks Mobile click state first, then Desktop hover state)
    const isDropdownOpen = (dropdownName, desktopState) => {
         if (window.innerWidth < 768 && isMobileMenuOpen) { 
            return activeMobileDropdown === dropdownName;
        }
         return desktopState;
    };


    return (
        <div className="header">
            <style>
                {`
                    .navbar-collapse {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .dropdown-menu {
                        margin-top: 0 !important;
                    }
                    .navbar-default .navbar-nav>li>a {
                        padding-bottom: 15px; /* Adjust as needed */
                    }
                     
                `}
            </style>
            <section id="intro">
                <div className="logo-menu">
                    <nav className="navbar navbar-default" role="navigation" data-spy="affix" data-offset-top="50">
                        <div className="container">
                            <div className="navbar-header">
                                <button
                                    type="button"
                                    className="navbar-toggle"
                                    onClick={toggleMobileMenu}
                                >
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <Link className="navbar-brand logo" to="/">
                                    <img src="/assets/img/logo.png" alt="Logo" />
                                </Link>
                            </div>
                            <div className={`navbar-collapse collapse ${isMobileMenuOpen ? 'in' : ''}`} id="navbar">
                                <ul className="nav navbar-nav">
                                    <li  >
                                        <Link to="/">
                                            Home <i className="fa fa-angle-down"></i>
                                        </Link>
                                    </li>

                                    {isLoggedIn && (
                                        <li
                                            className={`dropdown ${getActiveClass('pages')}`}
                                            onMouseEnter={() => handleMouseEnter(setIsPagesDropdownOpen)}
                                            onMouseLeave={() => handleMouseLeave(setIsPagesDropdownOpen)}
                                        >
                                            <Link to="#">
                                                Pages <i className="fa fa-angle-down"></i>
                                            </Link>
                                            <ul className={`dropdown-menu ${isPagesDropdownOpen ? 'show' : ''}`}>
                                               
                                                <li><Link to="/job/alljobs">Job Page</Link></li>
                                                
                                                <li><Link to="/faq">FAQ</Link></li>
                                                <li><Link to="/pricing">Pricing Tables</Link></li>
                                                <li><Link to="/contact">Contact</Link></li>
                                            </ul>
                                        </li>
                                    )}

                                    {isLoggedIn && userRole === 'JobSeeker' && (
                                        <li
                                            className={`dropdown ${getActiveClass('jobseeker')}`}
                                            onMouseEnter={() => handleMouseEnter(setIsCandidatesDropdownOpen)}
                                            onMouseLeave={() => handleMouseLeave(setIsCandidatesDropdownOpen)}
                                        >
                                            <Link to="#">
                                                Candidates <i className="fa fa-angle-down"></i>
                                            </Link>
                                            <ul className={`dropdown-menu ${isCandidatesDropdownOpen ? 'show' : ''}`}>
                                                <li><Link to="/job/alljobs">Browse Jobs</Link></li>
                                                 <li><Link to="/jobseeker/addjobseekerdetails">Create Resume</Link></li>
                                                <li><Link to="/jobseeker/myresume">My Resume</Link></li>
                                                <li><Link to="/manageapplication/myapplication">My Application</Link></li>
                                             </ul>
                                        </li>
                                    )}

                                    {isLoggedIn && userRole === 'Recruiter' && (
                                        <li
                                            className={`dropdown ${getActiveClass('recruiter')}`}
                                            onMouseEnter={() => handleMouseEnter(setIsEmployersDropdownOpen)}
                                            onMouseLeave={() => handleMouseLeave(setIsEmployersDropdownOpen)}
                                        >
                                            <Link to="#">
                                                Employers <i className="fa fa-angle-down"></i>
                                            </Link>
                                            <ul className={`dropdown-menu ${isEmployersDropdownOpen ? 'show' : ''}`}>
                                                <li><Link to="/recruiter/registercompany">Register Company</Link></li>
                                                <li><Link to="/job/postjob">Add Job</Link></li>
                                                <li><Link to="/job/managejobs">Manage Jobs</Link></li>
                                                <li><Link to="/manageapplication/manageapplications">Manage Applications</Link></li>
                                             </ul>
                                        </li>
                                    )}

                                  
                                </ul>

                                <ul className="nav navbar-nav navbar-right float-right">
                                    {isLoggedIn ? (
                                        <>
                                            {userRole === 'Recruiter' && (
                                                <li className="left"><Link to="/job/postjob"><i className="ti-pencil-alt"></i> Post A Job</Link></li>
                                            )}
                                            {userRole === 'JobSeeker' && (
                                                <li className="left"><Link to="/jobseeker/addjobseekerdetails"><i className="ti-pencil-alt"></i> Profile</Link></li>
                                            )}
                                            <li className="right">
                                                <button type="button" className="btn btn-link nav-link text-dark" onClick={handleLogout}>
                                                    <i className="ti-unlock ti-pencil-alt"></i> Log Out
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <li className="right"><Link to="/login"><i className="ti-lock"></i> Log In</Link></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <ul className="wpb-mobile-menu">
                            <li>
                                <Link className="active" to="/home/index">Home</Link>
                                <ul>
                                    <li><Link className="active" to="/home/index">Home 1</Link></li>
                                    <li><Link to="index-02.html">Home 2</Link></li>
                                    <li><Link to="index-03.html">Home 3</Link></li>
                                    <li><Link to="index-04.html">Home 4</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/about.html">Pages</Link>
                                <ul>
                                    <li><Link to="/about">About</Link></li>
                                    <li><Link to="/job-page">Job Page</Link></li>
                                    <li><Link to="/job-details">Job Details</Link></li>
                                    <li><Link to="/resume">Resume Page</Link></li>
                                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                    <li><Link to="/faq">FAQ</Link></li>
                                    <li><Link to="/pricing">Pricing Tables</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="#">For Candidates</Link>
                                <ul>
                                    <li><Link to="/browse-jobs">Browse Jobs</Link></li>
                                    <li><Link to="/browse-categories">Browse Categories</Link></li>
                                    <li><Link to="/add-resume">Add Resume</Link></li>
                                    <li><Link to="/manage-resumes">Manage Resumes</Link></li>
                                    <li><Link to="/job-alerts">Job Alerts</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="#">For Employers</Link>
                                <ul>
                                    <li><Link to="/post-job">Add Job</Link></li>
                                    <li><Link to="/manage-jobs">Manage Jobs</Link></li>
                                    <li><Link to="/manage-applications">Manage Applications</Link></li>
                                    <li><Link to="/browse-resumes">Browse Resumes</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="/blog">Blog</Link>
                                <ul className="dropdown">
                                    <li><Link to="/blog">Blog - Right Sidebar</Link></li>
                                    <li><Link to="/blog-left-sidebar">Blog - Left Sidebar</Link></li>
                                    <li><Link to="/blog-full-width">Blog - Full Width</Link></li>
                                    <li><Link to="/single-post">Blog Single Post</Link></li>
                                </ul>
                            </li>
                            <li className="btn-m"><Link to="/post-job"><i className="ti-pencil-alt"></i> Post A Job</Link></li>
                            <li className="btn-m"><Link to="/account/login"><i className="ti-lock"></i> Log In</Link></li>
                        </ul>

                        <ul className="wpb-mobile-menu">
                            {/* ... (mobile menu content) ... */}
                            <li>
                                <a className="active" href="/home/index">Home</a>
                                <ul>
                                    <li><a className="active" href="/home/index">Home 1</a></li>
                                    <li><a href="index-02.html">Home 2</a></li>
                                    <li><a href="index-03.html">Home 3</a></li>
                                    <li><a href="index-04.html">Home 4</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="about.html">Pages</a>
                                <ul>
                                    <li><a href="about.html">About</a></li>
                                    <li><a href="job-page.html">Job Page</a></li>
                                    <li><a href="job-details.html">Job Details</a></li>
                                    <li><a href="resume.html">Resume Page</a></li>
                                    <li><a href="privacy-policy.html">Privacy Policy</a></li>
                                    <li><a href="faq.html">FAQ</a></li>
                                    <li><a href="pricing.html">Pricing Tables</a></li>
                                    <li><a href="contact.html">Contact</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">For Candidates</a>
                                <ul>
                                    <li><a href="browse-jobs.html">Browse Jobs</a></li>
                                    <li><a href="browse-categories.html">Browse Categories</a></li>
                                    <li><a href="add-resume.html">Add Resume</a></li>
                                    <li><a href="manage-resumes.html">Manage Resumes</a></li>
                                    <li><a href="job-alerts.html">Job Alerts</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">For Employers</a>
                                <ul>
                                    <li><a href="post-job.html">Add Job</a></li>
                                    <li><a href="manage-jobs.html">Manage Jobs</a></li>
                                    <li><a href="manage-applications.html">Manage Applications</a></li>
                                    <li><a href="browse-resumes.html">Browse Resumes</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="blog.html">Blog</a>
                                <ul className="dropdown">
                                    <li><a href="blog.html">Blog - Right Sidebar</a></li>
                                    <li><a href="blog-left-sidebar.html">Blog - Left Sidebar</a></li>
                                    <li><a href="blog-full-width.html">Blog - Full Width</a></li>
                                    <li><a href="single-post.html">Blog Single Post</a></li>
                                </ul>
                            </li>
                            <li className="btn-m"><a href="post-job.html"><i className="ti-pencil-alt"></i> Post A Job</a></li>
                            <li className="btn-m"><a href="/account/login"><i className="ti-lock"></i> Log In</a></li>
                        </ul>
                    </nav>
                    <div className="navmenu navmenu-default navmenu-fixed-left offcanvas">
                        <div className="close" data-toggle="offcanvas" data-target=".navmenu">
                            <i className="ti-close"></i>
                        </div>
                        <h3 className="title-menu">All Pages</h3>
                        <ul className="nav navmenu-nav">
                            <li><Link to="/index-2">Home</Link></li>
                            <li><Link to="/index-02">Home Page 2</Link></li>
                            <li><Link to="/index-03">Home Page 3</Link></li>
                            <li><Link to="/index-04">Home Page 4</Link></li>
                            <li><Link to="/about">About us</Link></li>
                            <li><Link to="/job-page">Job Page</Link></li>
                            <li><Link to="/job-details">Job Details</Link></li>
                            <li><Link to="/resume">Resume Page</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/pricing">Pricing Tables</Link></li>
                            <li><Link to="/browse-jobs">Browse Jobs</Link></li>
                            <li><Link to="/browse-categories">Browse Categories</Link></li>
                            <li><Link to="/add-resume">Add Resume</Link></li>
                            <li><Link to="/manage-resumes">Manage Resumes</Link></li>
                            <li><Link to="/job-alerts">Job Alerts</Link></li>
                            <li><Link to="/post-job">Add Job</Link></li>
                            <li><Link to="/manage-jobs">Manage Jobs</Link></li>
                            <li><Link to="/manage-applications">Manage Applications</Link></li>
                            <li><Link to="/browse-resumes">Browse Resumes</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">Faq</Link></li>
                            <li><Link to="/account/login">Login</Link></li>
                        </ul>
                    </div>
                </div>
            </section>

             <div className="navmenu navmenu-default navmenu-fixed-left offcanvas">
             </div>
             <div className="tbtn wow pulse" id="menu" data-wow-iteration="infinite" data-wow-duration="500ms" data-toggle="offcanvas" data-target=".navmenu">
                <p><i className="ti-files"></i> All Pages</p>
            </div>
        </div>
    );
}

export default Header;