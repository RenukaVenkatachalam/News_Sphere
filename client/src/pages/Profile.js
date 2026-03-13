import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Settings, Save, Check } from 'lucide-react';

const availableCategories = ['Technology', 'Politics', 'Business', 'Science', 'Health', 'Sports', 'Entertainment'];

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [preferences, setPreferences] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && user.preferredCategories) {
      setPreferences(user.preferredCategories);
    }
  }, [user]);

  const toggleCategory = (category) => {
    if (preferences.includes(category)) {
      setPreferences(preferences.filter(c => c !== category));
    } else {
      setPreferences([...preferences, category]);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await api.patch('/user/preferences', {
        preferredCategories: preferences
      });

      setUser({ ...user, preferredCategories: res.data });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-card shadow-sm border border-slate-100 rounded-2xl p-8">

        <div className="flex items-center space-x-3 text-slate-800 mb-8 border-b border-slate-100 pb-6">
          <div className="p-3 bg-blue-50 text-primary rounded-full">
            <Settings size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-sm text-slate-500">
              Manage your profile and news preferences
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Profile Details
            </h3>
            <p className="text-sm text-slate-500">
              Your personal information
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>

              <input
                type="text"
                readOnly
                value={user.name}
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="text"
                readOnly
                value={user.email}
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-600 cursor-not-allowed"
              />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>

          </div>
        </div>

        <div className="h-px bg-slate-100 w-full mb-10"></div>

        <div className="grid md:grid-cols-3 gap-8 border-b border-slate-100 pb-10">

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              News Preferences
            </h3>

            <p className="text-sm text-slate-500">
              Select topics you want to see more of in your feed
            </p>
          </div>

          <div className="md:col-span-2">

            <div className="flex flex-wrap gap-3 mb-6">

              {availableCategories.map(cat => (

                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition flex items-center shadow-sm ${
                    preferences.includes(cat)
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preferences.includes(cat) && (
                    <Check size={14} className="mr-1.5" />
                  )}

                  {cat}

                </button>

              ))}

            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium focus:ring-4 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {saving ? (
                <>Saving...</>
              ) : success ? (
                <>
                  <Check size={18} />
                  <span>Saved Successfully</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Preferences</span>
                </>
              )}

            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;