export default function DashboardPage() {
  const stats = [
    ['Total Clients', '128', '+12%'],
    ['Active Plans', '94', '+8 this week'],
    ['Monthly Revenue', '₹1.84L', '+16.2%'],
    ['Success Rate', '87%', '7 need review'],
  ]
  const plans = [
    ['Riya Mehra', 'Fat Loss Veg Plan', '1780 kcal'],
    ['Arjun Singh', 'Lean Bulk Plan', '2640 kcal'],
    ['Neha Kapoor', 'Maintenance Vegan Plan', '1925 kcal'],
  ]
  return (
    <div className="stack">
      <section className="hero-card hero-grid">
        <div>
          <p className="muted-label">Premium trainer dashboard</p>
          <h2 className="section-title">Generate AI diet plans, manage clients, and track adherence</h2>
          <p className="subtle">Built for personal trainers who want one clean operating system for nutrition coaching.</p>
        </div>
        <div className="panel">
          <p className="muted-label">Quick Actions</p>
          <div className="stack" style={{ marginTop: 14 }}>
            <a href="/clients/add" className="primary-btn">Add New Client</a>
            <a href="/clients" className="ghost-btn">Open Client Management</a>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map(([label, value, note]) => (
          <div key={label} className="stat-card">
            <p className="subtle">{label}</p>
            <div className="kpi">{value}</div>
            <p className="badge" style={{ marginTop: 14 }}>{note}</p>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="table-card" style={{ padding: 22 }}>
          <h3 className="section-title">Recent clients</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Goal</th><th>Diet</th><th>Weight</th></tr></thead>
            <tbody>
              <tr><td>Riya Mehra</td><td>Fat Loss</td><td>Veg</td><td>68 kg</td></tr>
              <tr><td>Arjun Singh</td><td>Muscle Gain</td><td>Non-Veg</td><td>81 kg</td></tr>
              <tr><td>Neha Kapoor</td><td>Maintenance</td><td>Vegan</td><td>59 kg</td></tr>
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3 className="section-title">Latest plans</h3>
          <div className="stack">
            {plans.map(([client, title, kcal]) => (
              <div key={client} className="meal-card">
                <p className="muted-label">{client}</p>
                <h4 style={{ margin: '8px 0 6px' }}>{title}</h4>
                <p className="subtle">{kcal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
