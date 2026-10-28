
import React from "react";
import "./Documents.css";

import registration from "../../assets/documents/Certificate of Incorporation.pdf";
import certificate12A from "../../assets/documents/Darpan.pdf";
import certificate80G from "../../assets/documents/Licence Section 8.pdf";
import certificateCSR from "../../assets/documents/PAN.pdf";
import certificate from "../../assets/documents/registeration.pdf";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";

const documents = [
  {
    title: "Certificate of Incorporation",
    file: registration,
  },
  {
    title: "NGO Darpan Certificate",
    file: certificate12A,
  },
  {
    title: "Section 8 Licence",
    file: certificate80G,
  },
  {
    title: "PAN Card",
    file: certificateCSR,
  },
  {
    title: "Registration Certificate",
    file: certificate,
  },
];

export default function Documents() {
  return (
    <>
      <Navbar />
      <MainHeader />

      <main className="documents-page">
        <section className="documents-container">
          <span className="documents-label">
            <span className="documents-label-dot" />
            DOCUMENTS
          </span>

          <h1>Verified Documents</h1>

          <p className="documents-description">
            Access our official registration certificates and
            documents, ensuring transparency and trust.
          </p>

          <div className="documents-grid">
            {documents.map((doc) => (
              <article className="document-card" key={doc.title}>
                <div className="document-title">
                  {doc.title}
                </div>

                <div className="document-preview">
                  <iframe
                    src={`${doc.file}#toolbar=0&navpanes=0`}
                    title={doc.title}
                    className="document-pdf-frame"
                  />

                  <div className="document-actions">
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${doc.title}`}
                      title="View document"
                    >
                      ↗
                    </a>

                    <a
                      href={doc.file}
                      download
                      aria-label={`Download ${doc.title}`}
                      title="Download document"
                    >
                      ↓
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
