export default function SettingsPage() {
  const sections = ['Profile Settings', 'App Settings', 'Notification Settings', 'Billing', 'Theme Customization']
  return (
    <div className="stack">
      <section className="hero-card">
        <p className="muted-label">Workspace configuration</p>
        <h2 className="section-title">Settings</h2>
        <p className="subtle">Control account, branding, notifications, and billing preferences.</p>
      </section>
      {sections.map((section) => (
        <section key={section} className="settings-card">
          <h3 style={{ marginTop: 0 }}>{section}</h3>
          <p className="subtle">Configure {section.toLowerCase()} for your coaching workflow.</p>
        </section>
      ))}
    </div>
  )
}
