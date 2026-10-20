
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Contact.css";
import { createContact } from "../../services/contactService"
function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (status) setStatus("");
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setStatus("");

        try {
            const response = await createContact(formData);

            setStatus({
                type: "success",
                message: response.message || "Enquiry submitted successfully!",
            });

            // Form clear only after successful submission
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error.response?.data?.message ||
                    "Unable to submit your enquiry. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Navbar />

            <main className="contact-page">
                {/* HERO */}
                <section className="contact-hero">
                    <div className="contact-hero-decoration contact-decoration-one" />
                    <div className="contact-hero-decoration contact-decoration-two" />

                    <div className="contact-hero-content">
                        <span className="contact-eyebrow">
                            O POSITIVE HEALTH <span>•</span> CARE BEFORE CURE
                        </span>

                        <h1>
                            Every conversation
                            <br />
                            begins with <span>care.</span>
                        </h1>

                        <p>
                            We're here to listen, guide, and support you.
                            Whatever your healthcare journey looks like,
                            you don't have to navigate it alone.
                        </p>

                        <div className="contact-hero-badge">
                            <span className="contact-badge-heart">♡</span>
                            Compassion in every connection
                        </div>
                    </div>

                    <div className="contact-hero-art" aria-hidden="true">
                        <div className="hero-art-ring hero-ring-one" />
                        <div className="hero-art-ring hero-ring-two" />

                        <div className="hero-art-heart">
                            <span>♡</span>
                            <i>+</i>
                        </div>

                        <div className="hero-art-spark hero-spark-one">✦</div>
                        <div className="hero-art-spark hero-spark-two">✧</div>

                        <div className="hero-art-card">
                            <span className="hero-art-card-icon">✓</span>
                            <div>
                                <strong>You matter.</strong>
                                <small>Your wellbeing comes first.</small>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT CONTENT */}
                <section className="contact-content">
                    {/* LEFT SIDE */}
                    <div className="contact-info">
                        <span className="contact-section-label">
                            LET'S CONNECT
                        </span>

                        <h2>
                            A little conversation can make a
                            <span> big difference.</span>
                        </h2>

                        <p className="contact-description">
                            Have a question, need guidance, or want to
                            support our mission? Reach out to us. Our
                            team is here to help you take the next step.
                        </p>

                        {/* Healthcare illustration */}
                        <div className="contact-illustration" aria-hidden="true">
                            <div className="illustration-orbit orbit-one" />
                            <div className="illustration-orbit orbit-two" />

                            <div className="illustration-heart">
                                <span>♡</span>
                                <i>+</i>
                            </div>

                            <div className="illustration-spark spark-left">✦</div>
                            <div className="illustration-spark spark-right">✧</div>

                            <div className="floating-card floating-card-top">
                                <span className="floating-icon">♡</span>
                                <div>
                                    <strong>Care with heart</strong>
                                    <small>Every person matters</small>
                                </div>
                            </div>

                            <div className="floating-card floating-card-bottom">
                                <span className="floating-icon floating-icon-green">
                                    ✓
                                </span>
                                <div>
                                    <strong>We're here for you</strong>
                                    <small>One step at a time</small>
                                </div>
                            </div>
                        </div>

                        <div className="contact-promise">
                            <span className="promise-heart">♡</span>
                            <div>
                                <strong>Care before cure, always.</strong>
                                <p>Your voice deserves to be heard.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE FORM */}
                    <div className="contact-form-card">
                        <div className="contact-form-heading">
                            <span className="form-heading-icon">✉</span>

                            <div>
                                <h2>Send us a message</h2>
                                <p>We'd love to hear from you.</p>
                            </div>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="contact-field">
                                <label htmlFor="name">Full name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="email">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    maxLength={254}
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="phone">Phone number</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    maxLength={20}
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    maxLength={150}
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="message">Your message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    placeholder="Tell us a little about your enquiry..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    maxLength={3000}
                                />
                            </div>


                            {status && (
                                <div
                                    className={`contact-status contact-status-${status.type}`}
                                    role="status"
                                >
                                    {status.message}
                                </div>
                            )}



                            <button
                                className="contact-submit"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <span>
                                    {isSubmitting ? "Sending..." : "Send your enquiry"}
                                </span>
                                <span className="submit-arrow">
                                    {isSubmitting ? "…" : "→"}
                                </span>
                            </button>


                            <p className="contact-form-footnote">
                                <span>♡</span>
                                Your message matters to us.
                            </p>
                        </form>
                    </div>
                </section>

                {/* BOTTOM MESSAGE */}
                <section className="contact-bottom">
                    <span className="contact-bottom-heart">♡</span>
                    <p>
                        Sometimes, the first step towards care is simply
                        <strong> reaching out.</strong>
                    </p>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Contact;
