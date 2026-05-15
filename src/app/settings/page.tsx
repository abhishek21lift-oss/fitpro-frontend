export default function SettingsPage() {
  return (
    <div className="stack">
      <div style={{ marginBottom: 4 }}>
        <p className="muted-label">Account</p>
        <h2 className="section-title">Settings</h2>
      </div>
      {[
        { section: "Profile", fields: [["Full Name", "Abhishek Katiyar", "text"], ["Email", "coach@fitai.app", "email"], ["Phone", "+91 98765 43210", "tel"]] },
        { section: "Notifications", fields: [["Client updates email", "On", "text"], ["Plan reminders", "On", "text"]] },
        { section: "Billing", fields: [["Current plan", "Pro — ₹999/month", "text"], ["Next billing", "June 1, 2026", "text"]] },
      ].map(({ section, fields }) => (
        <div key={section} className="settings-card">
          <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 600 }}>{section}</h3>
          <div className="form-grid">
            {fields.map(([label, val, type]) => (
              <div key={label}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
                <input type={type} defaultValue={val} />
              </div>
            ))}
          </div>
          <button className="primary-btn" style={{ marginTop: 18 }}>Save {section}</button>
        </div>
      ))}
    </div>
  );
}
