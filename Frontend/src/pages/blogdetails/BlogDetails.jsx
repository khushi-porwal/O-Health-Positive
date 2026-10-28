
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BlogDetails.css";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import { getBlogBySlug } from "../../services/blogService";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";

function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        setBlog(null);

        const response = await getBlogBySlug(slug);

        const blogData =
          response?.blog ||
          response?.data?.blog ||
          response?.data ||
          response;

        if (!blogData?._id && !blogData?.slug) {
          throw new Error("Blog not found.");
        }

        if (isMounted) {
          setBlog(blogData);
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load this blog."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) fetchBlog();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <MainHeader />

      <section className="blog-details-section">
        <div className="blog-details-container">
          <button
            type="button"
            className="blog-back-button"
            onClick={() => navigate("/blog")}
          >
            ← Back to Blogs
          </button>

          {loading ? (
            <p>Loading blog...</p>
          ) : error || !blog ? (
            <div className="blog-details-message">
              <h2>Blog not found</h2>
              <p>{error || "This blog is not available."}</p>
              <button onClick={() => navigate("/blog")}>
                View All Blogs
              </button>
            </div>
          ) : (
            <article className="blog-details-article">
              {blog.coverImage && (
                <div className="blog-details-hero">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="blog-details-cover"
                  />
                </div>
              )}

              <div className="blog-details-meta">
                <span>{blog.category || "OUR BLOG"}</span>

                {blog.publishedAt && (
                  <span>
                    {new Date(blog.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                )}
              </div>

              <h1>{blog.title}</h1>

              {blog.author && (
                <p className="blog-details-author">
                  By {blog.author}
                </p>
              )}

              {blog.excerpt && (
                <p className="blog-details-intro">
                  {blog.excerpt}
                </p>
              )}

              <div className="blog-details-body">
                {blog.content}
              </div>

              {blog.pdfUrl && (
                <a
                  className="blog-pdf-link"
                  href={blog.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View PDF →
                </a>
              )}
            </article>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default BlogDetails;
