function Footer() {

    return (
        <>

            <footer>
                <section className="footer-Content">
                    <div className="container">
                        <div className="row">
                            {/* Company Info / About Section */}
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <h3 className="block-title"><img src="/assets/img/logo.png" className="img-responsive" alt="[Your Company Name] Logo" /></h3>
                                    <div className="textwidget">
                                        {/* Professional Description updated */}
                                        <p>
                                            Connecting talent with opportunity. We are dedicated to providing the best platform for job seekers to find their dream career and for companies to discover exceptional candidates. Your future starts here.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links Section */}
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <h3 className="block-title">Quick Links</h3>
                                    <ul className="menu">
                                        <li><a href="#">About Us</a></li>
                                        <li><a href="#">Support Center</a></li>  
                                        <li><a href="#">Privacy Policy</a></li>  
                                        <li><a href="#">Terms & Conditions</a></li>
                                        <li><a href="#">Contact Us</a></li>  
                                    </ul>
                                </div>
                            </div>

                            {/* Trending/Popular Jobs Section */}
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <h3 className="block-title">Popular Categories</h3>  
                                    <ul className="menu">
                                        <li><a href="#">Software Engineering</a></li>  
                                        <li><a href="#">Finance & Accounting</a></li>  
                                        <li><a href="#">Marketing Specialist</a></li>  
                                        <li><a href="#">Data Science</a></li>  
                                        <li><a href="#">Project Management</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Follow Us / Newsletter Section */}
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <h3 className="block-title">Stay Connected</h3>  
                                    <div className="bottom-social-icons social-icon">
                                        <a className="twitter" href="https://twitter.com/GrayGrids"><i className="ti-twitter-alt"></i></a>
                                        <a className="facebook" href="https://web.facebook.com/GrayGrids"><i className="ti-facebook"></i></a>
                                        <a className="youtube" href="https://youtube.com/"><i className="ti-youtube"></i></a>
                                        <a className="instagram" href="https://www.instagram.com/dharmeshbhati__167/?next=%2F&hl=en"><i className="ti-instagram"></i></a>
                                        <a className="linkedin" href="https://www.linkedin.com/in/dharmesh-bhati?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><i className="ti-linkedin"></i></a>
                                    </div>
                                    <p>Subscribe to our newsletter for the latest job listings and career advice!</p> 
                                    <form className="subscribe-box">
                                        <input type="email" placeholder="Your email address" />  
                                        <input type="submit" className="btn-system" value="Subscribe" />  
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Copyright Section   */}
                <div id="copyright">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="site-info text-center">
                                    
                                    <p>All Rights reserved &copy; **2025** - Designed & Developed by **Dharmesh Bhati** </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to Top button */}
            <a href="#" className="back-to-top">
                <i className="ti-arrow-up"></i>
            </a>
        </>
    )
}

export default Footer