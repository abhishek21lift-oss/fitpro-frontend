export default function DashboardPage() {
  const stats = [
    ["Total Clients", "128", "+12%"],
    ["Active Plans", "94", "+8 this week"],
    ["Monthly Revenue", "₹1.84L", "+16.2%"],
    ["Success Rate", "87%", "7 need review"],
  ];
  const plans = [
    ["Riya Mehra", "Fat Loss Veg Plan", "1780 kcal", "#eaf7ef", "#1d8348"],
    ["Arjun Singh", "Lean Bulk Plan", "2640 kcal", "#e8f0fb", "#0071e3"],
    ["Neha Kapoor", "Maintenance Vegan Plan", "1925 kcal", "#eaf7ef", "#1d8348"],
  ];
  return (
    <div className="stack">
      <section className="hero-card hero-grid">
        <div>
          <p className="muted-label" style={{ marginBottom: 8 }}>Premium trainer dashboard</p>
          <h2 className="section-title">AI-powered nutrition coaching, simplified</h2>
          <p className="subtle" style={{ marginTop: 8, maxWidth: 520 }}>
            Generate personalised diet plans, manage all clients, and track outcomes from one clean workspace.
          </p>
        </div>
        <div className="panel">
          <p className="muted-label">Quick actions</p>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="/clients/add" className="primary-btn" style={{ marginTop: 0, textAlign: "center" }}>Add new client</a>
            <a href="/clients" className="ghost-btn" style={{ textAlign: "center" }}>View all clients</a>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map(([label, value, note]) => (
          <div key={label} className="stat-card">
            <p className="muted-label">{label}</p>
            <div className="kpi">{value}</div>
            <span className="badge" style={{ marginTop: 10 }}>{note}</span>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="table-card">
          <div style={{ padding: "20px 20px 0" }}>
            <h3 className="section-title" style={{ fontSize: 17 }}>Recent clients</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Goal</th><th>Diet</th><th>Weight</th></tr>
            </thead>
            <tbody>
              <tr><td>Riya Mehra</td><td>Fat Loss</td><td>Veg</td><td>68 kg</td></tr>
              <tr><td>Arjun Singh</td><td>Muscle Gain</td><td>Non-Veg</td><td>81 kg</td></tr>
              <tr><td>Neha Kapoor</td><td>Maintenance</td><td>Vegan</td><td>59 kg</td></tr>
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3 className="section-title" style={{ fontSize: 17, marginBottom: 16 }}>Latest plans</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {plans.map(([client, title, kcal, bg, color]) => (
              <div key={client} className="meal-card">
                <p className="muted-label">{client}</p>
                <h4 style={{ margin: "6px 0 4px", fontSize: 14, fontWeight: 600 }}>{title}</h4>
                <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 980, fontSize: 12, fontWeight: 600, background: bg as string, color: color as string }}>{kcal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
