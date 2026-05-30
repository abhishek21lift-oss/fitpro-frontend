'use client';

export default function SettingsPage() {
  return (
    <div className="page-content animate-slide-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Settings
      </h1>

      <div className="space-y-6 max-w-3xl">
        {/* Profile */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" defaultValue="Dr. Arjun Mehta" />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" defaultValue="arjun@aifitness.in" />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Bio</label>
              <textarea
                className="input-field min-h-[80px]"
                defaultValue="Senior Fitness Coach with 10+ years of experience in strength training and sports nutrition. CSCS certified."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Receive updates when plans are generated or delivered', on: true },
              { label: 'WhatsApp Delivery', desc: 'Enable WhatsApp as delivery channel', on: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${item.on ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${item.on ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            ))}
            <div>
              <label className="input-label">Default Plan Duration</label>
              <select className="input-field" defaultValue="12">
                <option value="4">4 weeks</option>
                <option value="8">8 weeks</option>
                <option value="12">12 weeks</option>
                <option value="16">16 weeks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-red-200">
          <h3 className="text-base font-semibold text-red-600 mb-4">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">
            Export all your client data or permanently delete your account. These actions cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary">Export Data</button>
            <button className="btn text-red-600 bg-red-50 hover:bg-red-100 border border-red-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
