import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_Job || 'FALLBACK_URL_IF_ENV_IS_MISSING';
function HomePage() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 2;

    // Calculate jobs to display for the current page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

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
    fetchJobs();



    return (
        <>
            <div >
                <div className="text-center">
                    <div className="search-container">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <h1>Find the job that fits your life</h1>
                                    <br />
                                    <h2>
                                        More than <strong>12,000</strong> jobs are waiting to Kickstart your career!
                                    </h2>
                                    <div className="content">
                                        <form method="get" action="/Job/SearchResults">
                                            <div className="row">
                                                <div className="col-md-4 col-sm-6">
                                                    <div className="form-group">
                                                        <input
                                                            name="keywords"
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="job title / keywords / company name"
                                                        />
                                                        <i className="ti-time"></i>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6">
                                                    <div className="form-group">
                                                        <input
                                                            name="city"
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="city / province / zip code"
                                                        />
                                                        <i className="ti-location-pin"></i>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <div className="search-category-container">
                                                        <label className="styled-select">
                                                            <select name="category" className="dropdown-product selectpicker">
                                                                <option>All Categories</option>
                                                                <option>Finance</option>
                                                                <option>IT & Engineering</option>
                                                                <option>Education/Training</option>
                                                                <option>Art/Design</option>
                                                                <option>Sale/Markting</option>
                                                                <option>Healthcare</option>
                                                                <option>Science</option>
                                                                <option>Food Services</option>
                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-1 col-sm-6">
                                                    <button type="submit" className="btn btn-search-icon">
                                                        <i className="ti-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="popular-jobs">
                                        <b>Popular Keywords: </b>
                                        <a href="#">Web Design</a>
                                        <a href="#">Manager</a>
                                        <a href="#">Programming</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="find-job section">
                <div className="container">
                    <h2 className="section-title">Hot Jobs</h2>
                    <div className="row">
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


                        <div className="col-md-12">
                            <div className="showing pull-left">
                                <a href="/Job/AllJobs">
                                    {/*Showing <span>{model?.JobCards?.length || 0}</span> jobs of total...*/}
                                </a>
                            </div>
                            <ul className="pagination pull-right">
                                <li>
                                    <a href="/Job/AllJobs" className="btn btn-common">
                                        View All Jobs <i className="ti-angle-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="category section">
                <div className="container">
                    <h2 className="section-title">Browse Categories</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-home"></i>
                                    </div>
                                    <h3>Finance</h3>
                                    <p>4286 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-world"></i>
                                    </div>
                                    <h3>Sale/Markting</h3>
                                    <p>2000 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-book"></i>
                                    </div>
                                    <h3>Education/Training</h3>
                                    <p>1450 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-desktop"></i>
                                    </div>
                                    <h3>Technologies</h3>
                                    <p>5100 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-brush"></i>
                                    </div>
                                    <h3>Art/Design</h3>
                                    <p>5079 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-heart"></i>
                                    </div>
                                    <h3>Healthcare</h3>
                                    <p>3235 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-filter"></i>
                                    </div>
                                    <h3>Science</h3>
                                    <p>1800 jobs</p>
                                </a>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 f-category">
                                <a href="browse-jobs.html">
                                    <div className="icon">
                                        <i className="ti-cup"></i>
                                    </div>
                                    <h3>Food Services</h3>
                                    <p>4286 jobs</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="featured-jobs section">
                <div className="container">
                    <h2 className="section-title">Featured Jobs</h2>
                    <div className="row">
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="featured-item">
                                <div className="featured-wrap">
                                    <div className="featured-inner">
                                        <figure className="item-thumb">
                                            <a className="hover-effect" href="job-page.html">
                                                <img src="assets/img/features/img-1.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div className="item-body">
                                            <h3 className="job-title">
                                                <a href="job-page.html">Graphic Designer</a>
                                            </h3>
                                            <div className="adderess">
                                                <i className="ti-location-pin"></i> Dallas, United States
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-foot">
                                    <span>
                                        <i className="ti-calendar"></i> 4 months ago
                                    </span>
                                    <span>
                                        <i className="ti-time"></i> Full Time
                                    </span>
                                    <div className="view-iocn">
                                        <a href="job-page.html">
                                            <i className="ti-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="featured-item">
                                <div className="featured-wrap">
                                    <div className="featured-inner">
                                        <figure className="item-thumb">
                                            <a className="hover-effect" href="job-page.html">
                                                <img src="assets/img/features/img-2.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div className="item-body">
                                            <h3 className="job-title">
                                                <a href="job-page.html">Software Engineer</a>
                                            </h3>
                                            <div className="adderess">
                                                <i className="ti-location-pin"></i> Delaware, United States
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-foot">
                                    <span>
                                        <i className="ti-calendar"></i> 5 months ago
                                    </span>
                                    <span>
                                        <i className="ti-time"></i> Part Time
                                    </span>
                                    <div className="view-iocn">
                                        <a href="job-page.html">
                                            <i className="ti-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="featured-item">
                                <div className="featured-wrap">
                                    <div className="featured-inner">
                                        <figure className="item-thumb">
                                            <a className="hover-effect" href="job-page.html">
                                                <img src="assets/img/features/img-3.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div className="item-body">
                                            <h3 className="job-title">
                                                <a href="job-page.html">Managing Director</a>
                                            </h3>
                                            <div className="adderess">
                                                <i className="ti-location-pin"></i> NY, United States
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-foot">
                                    <span>
                                        <i className="ti-calendar"></i> 3 months ago
                                    </span>
                                    <span>
                                        <i className="ti-time"></i> Full Time
                                    </span>
                                    <div className="view-iocn">
                                        <a href="job-page.html">
                                            <i className="ti-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="featured-item">
                                <div className="featured-wrap">
                                    <div className="featured-inner">
                                        <figure className="item-thumb">
                                            <a className="hover-effect" href="job-page.html">
                                                <img src="assets/img/features/img-3.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div className="item-body">
                                            <h3 className="job-title">
                                                <a href="job-page.html">Graphic Designer</a>
                                            </h3>
                                            <div className="adderess">
                                                <i className="ti-location-pin"></i> Washington, United States
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-foot">
                                    <span>
                                        <i className="ti-calendar"></i> 1 months ago
                                    </span>
                                    <span>
                                        <i className="ti-time"></i> Part Time
                                    </span>
                                    <div className="view-iocn">
                                        <a href="job-page.html">
                                            <i className="ti-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="featured-item">
                                <div className="featured-wrap">
                                    <div className="featured-inner">
                                        <figure className="item-thumb">
                                            <a className="hover-effect" href="job-page.html">
                                                <img src="assets/img/features/img-2.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div className="item-body">
                                            <h3 className="job-title">
                                                <a href="job-page.html">Software Engineer</a>
                                            </h3>
                                            <div className="adderess">
                                                <i className="ti-location-pin"></i> Dallas, United States
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-foot">
                                    <span>
                                        <i className="ti-calendar"></i> 6 months ago
                                    </span>
                                    <span>
                                        <i className="ti-time"></i> Full Time
                                    </span>
                                    <div className="view-iocn">
                                        <a href="job-page.html">
                                            <i className="ti-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="featured-item">
                                <div className="featured-wrap">
                                    <div className="featured-inner">
                                        <figure className="item-thumb">
                                            <a className="hover-effect" href="job-page.html">
                                                <img src="assets/img/features/img-1.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div className="item-body">
                                            <h3 className="job-title">
                                                <a href="job-page.html">Managing Director</a>
                                            </h3>
                                            <div className="adderess">
                                                <i className="ti-location-pin"></i> NY, United States
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-foot">
                                    <span>
                                        <i className="ti-calendar"></i> 7 months ago
                                    </span>
                                    <span>
                                        <i className="ti-time"></i> Part Time
                                    </span>
                                    <div className="view-iocn">
                                        <a href="job-page.html">
                                            <i className="ti-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section purchase" data-stellar-background-ratio="0.5">
                <div className="container">
                    <div className="row">
                        <div className="section-content text-center">
                            <h1 className="title-text">Looking for a Job</h1>
                            <p>Join thousand of employers and earn what you deserve!</p>
                            <a href="my-account.html" className="btn btn-common">
                                Get Started Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section id="blog" className="section">
                <div className="container">
                    <h2 className="section-title">Latest News</h2>
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 blog-item">
                            <div className="blog-item-wrapper">
                                <div className="blog-item-img">
                                    <a href="single-post.html">
                                        <img src="assets/img/blog/home-items/img1.jpg" alt="" />
                                    </a>
                                </div>
                                <div className="blog-item-text">
                                    <div className="meta-tags">
                                        <span className="date">
                                            <i className="ti-calendar"></i> Dec 20, 2017
                                        </span>
                                        <span className="comments">
                                            <a href="#">
                                                <i className="ti-comment-alt"></i> 5 Comments
                                            </a>
                                        </span>
                                    </div>
                                    <a href="single-post.html">
                                        <h3>Tips to write an impressive resume online for beginner</h3>
                                    </a>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore praesentium asperiores ad vitae.
                                    </p>
                                    <a href="single-post.html" className="btn btn-common btn-rm">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 blog-item">
                            <div className="blog-item-wrapper">
                                <div className="blog-item-img">
                                    <a href="single-post.html">
                                        <img src="assets/img/blog/home-items/img2.jpg" alt="" />
                                    </a>
                                </div>
                                <div className="blog-item-text">
                                    <div className="meta-tags">
                                        <span className="date">
                                            <i className="ti-calendar"></i> Jan 20, 2018
                                        </span>
                                        <span className="comments">
                                            <a href="#">
                                                <i className="ti-comment-alt"></i> 5 Comments
                                            </a>
                                        </span>
                                    </div>
                                    <a href="single-post.html">
                                        <h3>Let's explore 5 cool new features in JobBoard theme</h3>
                                    </a>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore praesentium asperiores ad vitae.
                                    </p>
                                    <a href="single-post.html" className="btn btn-common btn-rm">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 blog-item">
                            <div className="blog-item-wrapper">
                                <div className="blog-item-img">
                                    <a href="single-post.html">
                                        <img src="assets/img/blog/home-items/img3.jpg" alt="" />
                                    </a>
                                </div>
                                <div className="blog-item-text">
                                    <div className="meta-tags">
                                        <span className="date">
                                            <i className="ti-calendar"></i> Mar 20, 2018
                                        </span>
                                        <span className="comments">
                                            <a href="#">
                                                <i className="ti-comment-alt"></i> 5 Comments
                                            </a>
                                        </span>
                                    </div>
                                    <a href="single-post.html">
                                        <h3>How to convince recruiters and get your dream job</h3>
                                    </a>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore praesentium asperiores ad vitae.
                                    </p>
                                    <a href="single-post.html" className="btn btn-common btn-rm">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="testimonial" className="section">
                <div className="container">
                    <div className="row">
                        <div className="touch-slider owl-carousel owl-theme">
                            <div className="item active text-center">
                                <img className="img-member" src="assets/img/testimonial/img1.jpg" alt="" />
                                <div className="client-info">
                                    <h2 className="client-name">
                                        Jessica <span>(Senior Accountant)</span>
                                    </h2>
                                </div>
                                <p>
                                    <i className="fa fa-quote-left quote-left"></i> The team that was assigned to our project... were
                                    extremely professional <i className="fa fa-quote-right quote-right"></i>
                                    <br /> throughout the project and assured that the owner expectations were met and <br /> often
                                    exceeded.{' '}
                                </p>
                            </div>
                            <div className="item text-center">
                                <img className="img-member" src="assets/img/testimonial/img2.jpg" alt="" />
                                <div className="client-info">
                                    <h2 className="client-name">
                                        John Doe <span>(Project Menager)</span>
                                    </h2>
                                </div>
                                <p>
                                    <i className="fa fa-quote-left quote-left"></i> The team that was assigned to our project... were
                                    extremely professional <i className="fa fa-quote-right quote-right"></i>
                                    <br /> throughout the project and assured that the owner expectations were met and <br /> often
                                    exceeded.{' '}
                                </p>
                            </div>
                            <div className="item text-center">
                                <img className="img-member" src="assets/img/testimonial/img3.jpg" alt="" />
                                <div className="client-info">
                                    <h2 className="client-name">
                                        Helen <span>(Engineer)</span>
                                    </h2>
                                </div>
                                <p>
                                    <i className="fa fa-quote-left quote-left"></i> The team that was assigned to our project... were
                                    extremely professional <i className="fa fa-quote-right quote-right"></i>
                                    <br /> throughout the project and assured that the owner expectations were met and <br /> often
                                    exceeded.{' '}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="clients section">
                <div class="container">
                    <h2 class="section-title">
                        Clients & Partners
                    </h2>
                    <div class="row">
                        <div id="clients-scroller">
                            <div class="items">
                                <img src="assets/img/clients/img1.png" alt=""/>
                            </div>
                            <div class="items">
                                <img src="assets/img/clients/img2.png" alt=""/>
                            </div>
                            <div class="items">
                                <img src="assets/img/clients/img3.png" alt=""/>
                            </div>
                            <div class="items">
                                <img src="assets/img/clients/img4.png" alt=""/>
                            </div>
                            <div class="items">
                                <img src="assets/img/clients/img5.png" alt=""/>
                            </div>
                            <div class="items">
                                <img src="assets/img/clients/img6.png" alt=""/>
                            </div>
                             
                        </div>
                    </div>
                </div>
            </section>
            <section id="counter">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <div className="counting">
                                <div className="icon">
                                    <i className="ti-briefcase"></i>
                                </div>
                                <div className="desc">
                                    <h2>Jobs</h2>
                                    <h1 className="counter">12050</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <div className="counting">
                                <div className="icon">
                                    <i className="ti-user"></i>
                                </div>
                                <div className="desc">
                                    <h2>Members</h2>
                                    <h1 className="counter">10890</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <div className="counting">
                                <div className="icon">
                                    <i className="ti-write"></i>
                                </div>
                                <div className="desc">
                                    <h2>Resume</h2>
                                    <h1 className="counter">700</h1>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <div class="counting">
                                <div class="icon">
                                    <i class="ti-heart"></i>
                                </div>
                                <div class="desc">
                                    <h2>Company</h2>
                                    <h1 class="counter">9050</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          
            <section class="infobox section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="info-text">
                                <h2>Don't Want To Miss a Thing?</h2>
                                <p>Just go to <a href="#">Google Play</a> to download JobBoard Mini</p>
                            </div>
                            <a href="#" class="btn btn-border">Google Play</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomePage;