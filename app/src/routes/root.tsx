import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Root(): React.ReactNode {
    useEffect(() => {
        // var t = {
        //     whatsapp: "2348145737179",
        //     call_to_action: "Hi",
        //     position: "right"
        // },
        //     e = document.location.protocol,
        //     n = e + "//static.getbutton.io",
        //     o = document.createElement("script");
        // o.type = "text/javascript", o.async = !0, o.src = n + "/widget-send-button/js/init.js", o.onload = function () {
        //     WhWidgetSendButton.init("getbutton.io", e, t)
        // };
        // var i = document.getElementsByTagName("script")[0];
        // i.parentNode.insertBefore(o, i)
    }, [])
    return (
        <>
            <main>
                <header id="header">
                    <div className="overlay overlay-lg">
                        <img src="/img/shapes/square.png" className="shape square" alt="" />
                        <img src="/img/shapes/circle.png" className="shape circle" alt="" />
                        <img src="/img/shapes/half-circle.png" className="shape half-circle1" alt="" />
                        <img src="/img/shapes/half-circle.png" className="shape half-circle2" alt="" />
                        <img src="/img/shapes/x.png" className="shape xshape" alt="" />
                        <img src="/img/shapes/wave.png" className="shape wave wave1" alt="" />
                        <img src="/img/shapes/wave.png" className="shape wave wave2" alt="" />
                        <img src="/img/shapes/triangle.png" className="shape triangle" alt="" />
                        <img src="/img/shapes/letters.png" className="letters" alt="" />
                        <img src="/img/shapes/points1.png" className="points points1" alt="" />
                    </div>
                    <nav>
                        <div className="container">
                            <div className="logo">
                                <img src="/img/tee_developer_logo.png" alt="" />
                            </div>

                            <div className="links">
                                <ul>
                                    <li>
                                        <a href="#header">Home</a>
                                    </li>
                                    <li>
                                        <a href="#services">Services</a>
                                    </li>
                                    <li>
                                        <a href="#portfolio">Portfolio</a>
                                    </li>
                                    <li>
                                        <a href="#about">About</a>
                                    </li>
                                    <li>
                                        <a href="#testimonials">Testimonials</a>
                                    </li>
                                    <li>
                                        <a href="#contact">Contact</a>
                                    </li>
                                    <li>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="active">Hire
                                            us</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="hamburger-menu">
                                <div className="bar"></div>
                            </div>
                        </div>
                    </nav>

                    <div className="header-content">
                        <div className="container grid-2">
                            <div className="column-1">
                                <h1 className="header-title teeskid_container">
                                    <p className="teeskid_type">Techify Systems</p>
                                </h1>
                                <p className="text">
                                    Techify Systems offers professional web site design, company logos, mobile app, UI/UX
                                    and
                                    digital illustration by freelance web developers/graphic designers.
                                </p>
                                <Link to="/sign-up" target="_blank" className="btn">Join Us</Link>
                                <a href="https://wa.me/2348145737179" target="_blank" className="btn">CHAT US NOW</a>
                            </div>
                            <div className="column-2 image">
                                <img src="/img/tee_developer_logo.png" className="img-element z-index" alt="" />
                            </div>
                        </div>
                    </div>
                </header>

                <section className="services section" id="services">
                    <div className="container">
                        <div className="section-header">
                            <h3 className="title" data-title="What we Do">Services</h3>
                            <p className="text">

                            </p>
                        </div>

                        <div className="cards">
                            <div className="card-wrap">
                                <img src="/img/shapes/points3.png" className="points points1 points-sq" alt="" />
                                <div className="card" data-card="UI/UX">
                                    <div className="card-content z-index">
                                        <img src="/img/design-icon.png" className="icon" alt="" />
                                        <h3 className="title-sm">Web Design</h3>
                                        <p className="text">
                                            We are Expert in Web Design
                                        </p>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="btn small">Hire Us</a>
                                    </div>
                                </div>
                            </div>

                            <div className="card-wrap">
                                <div className="card" data-card="Code">
                                    <div className="card-content z-index">
                                        <img src="/img/code-icon.png" className="icon" alt="" />
                                        <h3 className="title-sm">Web Development</h3>
                                        <p className="text">
                                            We have professionals who can satisfy you with your want of preferable website.
                                        </p>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="btn small">Hire Us</a>
                                    </div>
                                </div>
                            </div>

                            <div className="card-wrap">
                                <img src="/img/shapes/points3.png" className="points points2 points-sq" alt="" />
                                <div className="card" data-card="App">
                                    <div className="card-content z-index">
                                        <img src="/img/app-icon.png" className="icon" alt="" />
                                        <h3 className="title-sm">App Development</h3>
                                        <p className="text">
                                            We have experts ready to make best mobile apps.
                                        </p>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="btn small">Hire Us</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <!--<section className="portfolio section" id="portfolio">-->
                    <!--<div className="background-bg">-->
                        <!--    <div className="overlay overlay-sm">-->
                            <!--        <img src="/img/shapes/half-circle.png" className="shape half-circle1" alt="" />-->
                            <!--        <img src="/img/shapes/half-circle.png" className="shape half-circle2" alt="" />-->
                            <!--        <img src="/img/shapes/square.png" className="shape square" alt="" />-->
                            <!--        <img src="/img/shapes/wave.png" className="shape wave" alt="" />-->
                            <!--        <img src="/img/shapes/circle.png" className="shape circle" alt="" />-->
                            <!--        <img src="/img/shapes/triangle.png" className="shape triangle" alt="" />-->
                            <!--        <img src="/img/shapes/x.png" className="shape xshape" alt="" />-->
                            <!--    </div>-->
                        <!--</div>-->

                    <!--<div className="container">-->
                        <!--    <div className="section-header">-->
                            <!--        <h3 className="title" data-title="Our works">Portfolio</h3>-->
                            <!--    </div>-->

                        <!--    <div className="section-body">-->
                            <!--<div className="filter">-->
                                <!--    <button className="filter-btn active" data-filter="*">All</button>-->
                                <!--    <button className="filter-btn" data-filter=".ui">UI/UX</button>-->
                                <!--    <button className="filter-btn" data-filter=".webdev">Web Dev</button>-->
                                <!--    <button className="filter-btn" data-filter=".appdev">-->
                                    <!--        Mobile App-->
                                    <!--    </button>-->
                                <!--    <button className="filter-btn" data-filter=".logo-design">-->
                                    <!--        Logo Design-->
                                    <!--    </button>-->
                                <!--</div>-->

                            <!--<div className="grid">-->
                                <!--    <div className="grid-item logo-design">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/yakata_data.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>Logo Design</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item webdev">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/web.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>Web Development</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item ui webdev">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/web2.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>Web Design</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item ui">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/ui_ux1.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>UI / UX Design</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item logo-design">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/logo.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>Logo Design</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item appdev">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/app1.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>App Development</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item logo-design">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/n3tdata_logo.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>Logo Design</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item appdev ui">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/app2.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>App Development</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item appdev ui">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/app3.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>App Development</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--    <div className="grid-item ui webdev">-->
                                    <!--        <div className="gallery-image">-->
                                        <!--            <img src="/img/gift.png" alt="" />-->
                                        <!--            <div className="img-overlay">-->
                                            <!--                <div className="plus"></div>-->
                                            <!--                <div className="img-description">-->
                                                <!--                    <h3>Web Design</h3>-->
                                                <!--                    <h5>View Demo</h5>-->
                                                <!--                </div>-->
                                            <!--            </div>-->
                                        <!--        </div>-->
                                    <!--    </div>-->
                                <!--</div>-->
                            <!--    <div className="more-folio">-->
                                <!--        <a href="https://wa.me/2348145737179" target="_blank" className="btn">Hire Us</a>-->
                                <!--    </div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</section>--> */}

                <section className="about section" id="about">
                    <div className="container">
                        <div className="section-header">
                            <h3 className="title" data-title="About Us">About us</h3>
                        </div>

                        <div className="section-body grid-2">
                            <div className="column-1">
                                <h3 className="title-sm">Hello, we are Techify Systems</h3>
                                <p className="text">
                                    we create robust,secure and affordable website, as well as graphics design for small and
                                    large scale business
                                    owners around the world we also promote your business/brand via our dynamic digital
                                    marketing skills.
                                </p>

                                <a href="https://wa.me/2348145737179" target="_blank" className="btn">Join Techify</a>
                                <a href="https://wa.me/2348145737179" target="_blank" className="btn">Hire Us</a>
                            </div>

                            <div className="column-2 image">

                                <img src="/img/developer_vector.png" className="z-index" alt="" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="records">
                    <div className="overlay overlay-sm">
                        <img src="/img/shapes/square.png" alt="" className="shape square1" />
                        <img src="/img/shapes/square.png" alt="" className="shape square2" />
                        <img src="/img/shapes/circle.png" alt="" className="shape circle" />
                        <img src="/img/shapes/half-circle.png" alt="" className="shape half-circle" />
                        <img src="/img/shapes/wave.png" alt="" className="shape wave wave1" />
                        <img src="/img/shapes/wave.png" alt="" className="shape wave wave2" />
                        <img src="/img/shapes/x.png" alt="" className="shape xshape" />
                        <img src="/img/shapes/triangle.png" alt="" className="shape triangle" />
                    </div>

                    <div className="container">
                        <div className="wrap">
                            <div className="record-circle">
                                <h2 className="number" data-num="235">30</h2>
                                <h4 className="sub-title">Projects</h4>
                            </div>
                        </div>

                        <div className="wrap">
                            <div className="record-circle active">
                                <h2 className="number" data-num="174">100000</h2>
                                <h4 className="sub-title">Happy Clients</h4>
                            </div>
                        </div>

                        <div className="wrap">
                            <div className="record-circle">
                                <h2 className="number" data-num="892">7</h2>
                                <h4 className="sub-title">Work Hour</h4>
                            </div>
                        </div>

                        <div className="wrap">
                            <div className="record-circle">
                                <h2 className="number" data-num="368">5</h2>
                                <h4 className="sub-title">Awards</h4>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="blog section">
                    <div className="container">
                        <div className="section-header">
                            <h3 className="title" data-title="Last News">Our blog</h3>
                            <p className="text">

                            </p>
                        </div>

                        <div className="blog-wrapper">
                            <div className="blog-wrap">
                                <img src="/img/shapes/points3.png" alt="" className="points points-sq" />

                                <div className="blog-card">
                                    <div className="blog-image">
                                        <img src="/img/web_master.png" alt="" />
                                    </div>

                                    <div className="blog-content">
                                        <div className="blog-info">
                                            <h5 className="blog-date">March, 19 2020</h5>
                                            <h5 className="blog-user"><i className="fas fa-user"></i>Teeskid Developer</h5>
                                        </div>
                                        <h3 className="title-sm">WEB MASTER</h3>
                                        <p className="blog-text">
                                            Do You Wish To Become A Web Master?
                                        </p>
                                        <Link to="/sign-up" target="_blank" className="btn small">Join Us</Link>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="btn small">Chat Us Now</a>
                                    </div>
                                </div>
                            </div>

                            <div className="blog-wrap">
                                <div className="blog-card">
                                    <div className="blog-image">
                                        <img src="/img/app_development.png" alt="" />
                                    </div>

                                    <div className="blog-content">
                                        <div className="blog-info">
                                            <h5 className="blog-date">March, 19 2020</h5>
                                            <h5 className="blog-user"><i className="fas fa-user"></i>Teeskid Developer</h5>
                                        </div>
                                        <h3 className="title-sm">APP DEVELOPMENT</h3>
                                        <p className="blog-text">
                                            Learn App Development at ease (FLUTTER / ANDROID STUDIO)
                                        </p>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="btn small">Chat Us
                                            Now</a>
                                    </div>
                                </div>
                            </div>

                            <div className="blog-wrap">
                                <div className="blog-card">
                                    <div className="blog-image">
                                        <img src="/img/ui_ux_logo.png" alt="" />
                                    </div>

                                    <div className="blog-content">
                                        <div className="blog-info">
                                            <h5 className="blog-date">March, 19 2020</h5>
                                            <h5 className="blog-user"><i className="fas fa-user"></i>Teeskid Amaedy</h5>
                                        </div>
                                        <h3 className="title-sm">UI/UX</h3>
                                        <p className="blog-text">
                                            Learn UI / UX at ease (FIGMA)
                                        </p>
                                        <a href="https://wa.me/2348145737179" target="_blank" className="btn small">Chat Us
                                            Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="testimonials section" id="testimonials">
                    <div className="container">
                        <div className="section-header">
                            <h3 className="title" data-title="What People Say">Testimonials</h3>
                        </div>

                        <div className="testi-content grid-2">
                            <div className="column-1 reviews">
                                <div className="swiper-container">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide review">
                                            <i className="fas fa-quote-left quote"></i>
                                            <div className="rate">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>

                                            <p className="review-text">
                                                What i liked most was about the service was the consistent and high quality
                                                service, which was friendly and 100 percent satisfactory. I recommend Techify Systems, they're fast and reliable.
                                            </p>

                                            <div className="review-info">
                                                <h3 className="review-name">*** CE0</h3>
                                                <h5 className="review-job">***</h5>
                                            </div>
                                        </div>

                                        <div className="swiper-slide review">
                                            <i className="fas fa-quote-left quote"></i>
                                            <div className="rate">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>

                                            <p className="review-text">
                                                Great jobs i got from their organization. They are one of the best.
                                            </p>

                                            <div className="review-info">
                                                <h3 className="review-name">*** CEO</h3>
                                                <h5 className="review-job">****</h5>
                                            </div>
                                        </div>

                                        <div className="swiper-slide review">
                                            <i className="fas fa-quote-left quote"></i>
                                            <div className="rate">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>

                                            <p className="review-text">
                                                I can really say that since I joined these site I have been earning more than
                                                before and i love the quick response to issues. We might just get along well. So
                                                far so good. There's no star here but I give ⭐⭐⭐⭐..
                                            </p>

                                            <div className="review-info">
                                                <h3 className="review-name">**** CEO</h3>
                                                <h5 className="review-job">**</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="review-nav swiper-button-prev">
                                        <i className="fas fa-long-arrow-alt-left"></i>
                                    </div>
                                    <div className="review-nav swiper-button-next">
                                        <i className="fas fa-long-arrow-alt-right"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="column-2 image">
                                <img src="/img/happy.png" alt="" className="img-element" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="contact" id="contact">
                    <div className="container">
                        <div className="contact-box">
                            <div className="contact-info">
                                <h3 className="title">Get in touch</h3>
                                <p className="text">

                                </p>
                                <div className="information-wrap">
                                    <div className="information">
                                        <div className="contact-icon">
                                            <i className="fas fa-map-marker-alt"></i>
                                        </div>
                                        <p className="info-text">FUNTUA-YASHE ROAD, JIKAMSHI<br />KATSINA STATE NIGERIA.</p>
                                    </div>

                                    <div className="information">
                                        <div className="contact-icon">
                                            <i className="fas fa-paper-plane"></i>
                                        </div>
                                        <p className="info-text">techifyitsolution@gmail.com</p>
                                    </div>

                                    <div className="information">
                                        <div className="contact-icon">
                                            <i className="fas fa-phone-alt"></i>
                                        </div>
                                        <p className="info-text">08145737179</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form">
                                <h3 className="title">Contact us</h3>
                                <div className="row">
                                    <input type="text" className="contact-input" placeholder="First Name" />
                                    <input type="text" className="contact-input" placeholder="Last Name" />
                                </div>

                                <div className="row">
                                    <input type="text" className="contact-input" placeholder="Phone" />
                                    <input type="email" className="contact-input" placeholder="Email" />
                                </div>

                                <div className="row">
                                    <textarea name="message" className="contact-input textarea" placeholder="Message"></textarea>
                                </div>
                                <a href="#" className="btn">Send</a>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="hireme" id="hireme">
                    <div className="container">
                        <h3 className="title">Let's talk about a project</h3>
                        <p className="text">
                            WE ARE FAST AND RELIABLE
                        </p>
                        <a href="https://wa.me/2348145737179" target="_blank" className="btn">Hire us</a>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <div className="grid-4">
                        <div className="grid-4-col footer-about">
                            <h3 className="title-sm">About</h3>
                            <p className="text">
                                we create robust,secure and affordable website, as well as graphics design for small and large
                                scale business owners around the world we also promote your business/brand via our dynamic
                                digital marketing skills.
                            </p>
                        </div>

                        <div className="grid-4-col footer-links">
                            <h3 className="title-sm">Links</h3>
                            <ul>
                                <li>
                                    <a href="#services">Services</a>
                                </li>
                                <li>
                                    <a href="#portfolio">Portfolio</a>
                                </li>
                                <li>
                                    <a href="#about">About</a>
                                </li>
                                <li>
                                    <a href="#testimonials">Testimonials</a>
                                </li>
                                <li>
                                    <a href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                        <div className="grid-4-col footer-links">
                            <h3 className="title-sm">Services</h3>
                            <ul>
                                <li>
                                    <a href="#">Web Design</a>
                                </li>
                                <li>
                                    <a href="#">Web Dev</a>
                                </li>
                                <li>
                                    <a href="#">App Design</a>
                                </li>
                                <li>
                                    <a href="#">Marketing</a>
                                </li>
                                <li>
                                    <a href="#">UI Design</a>
                                </li>
                            </ul>
                        </div>

                        <div className="grid-4-col footer-newstletter">
                            <h3 className="title-sm">Subscribe</h3>
                            <p className="text">

                            </p>
                            <div className="footer-input-wrap">
                                <input type="email" className="footer-input" placeholder="Email" />
                                <a href="#" className="input-arrow">
                                    <i className="fas fa-angle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-footer">
                        <div className="copyright">
                            <p className="text">
                                Copyright&copy; 2023 All rights reserved | Powered by
                                <span>Techify Systems</span>
                            </p>
                        </div>

                        <div className="followme-wrap">
                            <div className="followme">
                                <h3>Follow us</h3>
                                <span className="footer-line"></span>
                                <div className="social-media">
                                    <a href="#">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                </div>
                            </div>

                            <div className="back-btn-wrap">
                                <a href="#" className="back-btn">
                                    <i className="fas fa-chevron-up"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
