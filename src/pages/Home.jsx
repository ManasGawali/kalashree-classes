import { Link } from "react-router-dom";

const BATCHES = [
  { name: "Prarambhik", syllabus: "/syllabus/syllabus_prarambhik.pdf" },
  { name: "Praveshika Pratham", syllabus: "/syllabus/syllabus_praveshika.pdf" },
  { name: "Praveshika Poorna", syllabus: "/syllabus/syllabus_praveshika.pdf" },
  { name: "Madhyama Pratham", syllabus: "/syllabus/syllabus_madhyama.pdf" },
  { name: "Madhyama Poorna", syllabus: "/syllabus/syllabus_madhyama.pdf" },
  { name: "Visharad Pratham", syllabus: "/syllabus/syllabus_visharad.pdf" },
  { name: "Visharad Poorna", syllabus: "/syllabus/syllabus_visharad.pdf" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #f5ede3, #fbf8f5)", padding: "48px 16px 40px" }}>
        <div className="container text-center">
          <h1 className="font-serif" style={{ fontSize: 30, color: "var(--wood-dark)", marginBottom: 10 }}>
            Kalashree Music Classes
          </h1>
          <p className="text-muted" style={{ maxWidth: 480, margin: "0 auto 22px", fontSize: 15 }}>
            Learn Indian classical music with structured batches, from Prarambhik to Visharad —
            guided by experienced gurus, one taal at a time.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login" className="btn btn-primary">Student Login</Link>
          </div>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 14 }}>
            Interested in joining? Contact us below to get enrolled.
          </p>
        </div>
      </section>

      {/* Batches & Material (The 7 Boxes) */}
      <section className="container" style={{ padding: "36px 16px" }}>
        <h2 className="section-title">Batches and Material</h2>
        <p className="section-sub">Progressive levels designed to build a strong musical foundation.</p>
        
        {/* REPLACED .grid-3 WITH RESPONSIVE INLINE GRID */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "16px" 
        }}>
          {BATCHES.map((b) => (
            <div className="card" key={b.name} style={{ padding: "20px" }}>
              <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--wood-dark)", fontSize: 18 }}>
                {b.name}
              </div>
              {/* Added flexWrap: "wrap" to ensure buttons don't break out of the card on very tiny screens */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a
                  href={b.syllabus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, minWidth: "100px", textAlign: "center", padding: "10px 0", fontSize: 14 }}
                >
                  Syllabus
                </a>
                <a
                  href="#resources"
                  className="btn btn-outline"
                  style={{ flex: 1, minWidth: "100px", textAlign: "center", padding: "10px 0", fontSize: 14 }}
                >
                  Resources
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Class Information / General Resources */}
      <section id="resources" className="container" style={{ padding: "20px 16px 40px", scrollMarginTop: 80 }}>
        <h2 className="section-title">Class Information</h2>
        
        {/* REPLACED .grid-2 WITH RESPONSIVE INLINE GRID */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "16px" 
        }}>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 16, margin: "0 0 8px", color: "var(--wood-dark)" }}>Timings</h3>
            <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
              Monday to Saturday, 4:00 PM – 8:00 PM. Batch-specific slots are shared after enrollment.
            </p>
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 16, margin: "0 0 8px", color: "var(--wood-dark)" }}>Fee Payment</h3>
            <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
              Monthly fees can be paid securely online via UPI from your student dashboard —
              single month or multiple months at once.
            </p>
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 16, margin: "0 0 8px", color: "var(--wood-dark)" }}>Curriculum</h3>
            <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
              Structured progression across 7 levels — Prarambhik through Visharad Poorna —
              aligned with classical music examination boards.
            </p>
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 16, margin: "0 0 8px", color: "var(--wood-dark)" }}>Contact</h3>
            <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
              For enquiries, reach us at kalashreemusic@gmail.com or visit us during class hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}