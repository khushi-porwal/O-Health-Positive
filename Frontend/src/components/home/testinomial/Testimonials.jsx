
import { useState } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Anit Sharma",
    initials: "AS",
    text: "Donating to O Positive Health Foundation is simple and reassuring. I could support a cause quickly, and I appreciate the focus on helping people access the care they need.",
  },
  {
    id: 2,
    name: "Rohan Das",
    initials: "RD",
    text: "What I like most is the focus on impact — supporting urgent healthcare needs and helping people when funds are the biggest barrier. Every contribution can make a difference.",
  },
  {
    id: 3,
    name: "Amit Verma",
    initials: "AV",
    text: "I have supported charitable causes before, but O Positive Health Foundation stands out for its commitment to care and compassion. The mission inspires me to keep contributing.",
  },
  {
    id: 4,
    name: "Neha Reddy",
    initials: "NR",
    text: "The foundation's healthcare initiatives are meaningful. I appreciate the focus on helping communities and making healthcare support accessible to people who need it.",
  },
  {
    id: 5,
    name: "Priya Singh",
    initials: "PS",
    text: "Supporting a healthcare mission feels meaningful when the goal is to bring hope to families. I am glad to see more attention given to community healthcare.",
  },
  {
    id: 6,
    name: "Rahul Mehta",
    initials: "RM",
    text: "I believe everyone deserves access to essential healthcare. Initiatives that bring care closer to communities can help create a positive and lasting difference.",
  },
];

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleCount = 4;

  const nextSlide = () => {
    setActiveIndex((current) =>
      (current + 1) % testimonials.length
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      (current - 1 + testimonials.length) % testimonials.length
    );
  };

  const visibleTestimonials = Array.from(
    { length: Math.min(visibleCount, testimonials.length) },
    (_, index) =>
      testimonials[(activeIndex + index) % testimonials.length]
  );

  return (
    <section className="testimonials-section" id="testimonials">
      <span
        className="testimonial-decoration testimonial-decoration-left"
        aria-hidden="true"
      >
        ✣<br />✣ ✣<br />✣ ✣<br />✣
      </span>

      <span
        className="testimonial-decoration testimonial-decoration-right"
        aria-hidden="true"
      >
        ♥
      </span>

      <header className="testimonials-header">
        <span className="testimonials-eyebrow">
          VOICES OF COMPASSION
        </span>

        <h2>
          How Do Donors Describe Their Experience
          <br className="testimonial-desktop-break" />
          With Our NGO?
        </h2>

        <p>
          Every story reminds us why compassionate healthcare matters.
        </p>
      </header>

      <div className="testimonials-grid">
        {visibleTestimonials.map((testimonial) => (
          <article
            className="testimonial-card"
            key={testimonial.id}
          >
            <div className="testimonial-quote">
              <span className="testimonial-quote-mark" aria-hidden="true">
                “
              </span>

              <p>{testimonial.text}</p>
            </div>

            <div className="testimonial-author">
              <div className="testimonial-avatar">
                {testimonial.initials}
              </div>

              <div className="testimonial-author-info">
                <h3>{testimonial.name}</h3>
                <span>Community Supporter</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="testimonials-controls">
        <button
          type="button"
          onClick={prevSlide}
          className="testimonial-arrow"
          aria-label="Previous testimonials"
        >
          ←
        </button>

        <span className="testimonial-slide-count">
          {activeIndex + 1} / {testimonials.length}
        </span>

        <button
          type="button"
          onClick={nextSlide}
          className="testimonial-arrow"
          aria-label="Next testimonials"
        >
          →
        </button>
      </div>
    </section>
  );
}

export default Testimonials;
