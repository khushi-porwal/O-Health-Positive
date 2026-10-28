
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

import live from "../../assets/live.png";
import MainHeader from "../../components/layout/Header/Header";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import { getPublishedBlogs } from "../../services/blogService";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";

function Blog() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublishedBlogs();

        // Supports common API response formats
        const publishedBlogs =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.blogs)
                ? response.blogs
                : Array.isArray(response?.data?.blogs)
                  ? response.data.blogs
                  : [];

        if (isMounted) {
          setBlogs(publishedBlogs);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load blogs. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <MainHeader />

      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-heading">
            <span className="section-label">
              <span className="green-dot"></span>
              OUR BLOG
            </span>

            <h1>Latest Stories & Updates</h1>

            <p>
              Explore stories, awareness campaigns, and inspiring ideas
              that create positive change in our community.
            </p>
          </div>

          {loading ? (
            <p>Loading blogs...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : blogs.length === 0 ? (
            <p>No published blogs available yet.</p>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <article className="blog-card" key={blog._id || blog.slug}>
                  <div className="blog-image-wrapper">
                    <img
                      src={blog.coverImage || live}
                      alt={blog.title || "O Positive Health blog"}
                      className="blog-image"
                    />
                  </div>

                  <div className="blog-content">
                    <h2>{blog.title}</h2>

                    <p className="blog-description">
                      {blog.excerpt || ""}
                    </p>

                    <div className="blog-footer">
                      <div className="posted">
                        <span className="calendar">▣</span>

                        <div>
                          <span className="posted-text">
                            Posted On
                          </span>

                          <strong>
                            {blog.publishedAt
                              ? new Date(
                                  blog.publishedAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Recently published"}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="read-btn"
                        onClick={() =>
                          navigate(
                            `/blog/${encodeURIComponent(
                              blog.slug || blog._id
                            )}`
                          )
                        }
                      >
                        Read More
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Blog;
