"use client";
import { useState } from 'react';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [learnWhy, setLearnWhy] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [learnSubjects, setLearnSubjects] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeProfile = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setProfile(null); setJobs(null); setRoadmap(null); setLearnWhy(null);
    
    const formData = new FormData();
    const form = e.target;
    formData.append('skills', (form.elements.skills as HTMLInputElement).value);
    formData.append('interests', (form.elements.interests as HTMLInputElement).value);
    formData.append('education', (form.elements.education as HTMLInputElement).value);
    formData.append('target_role', (form.elements.target_role as HTMLInputElement).value);

    try {
      const response = await fetch('http://localhost:8000/api/profile', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Backend not responding');
      setProfile(await response.json());
    } catch (err) {
      setError("Backend not running? Check Terminal 1 (uvicorn port 8000)");
    } finally {
      setLoading(false);
    }
  };

  const getJobs = async () => {
    const formData = new FormData();
    formData.append('target_role', profile.summary.split('for ')[1] || 'Software Engineer');
    const res = await fetch('http://localhost:8000/api/jobs', { method: 'POST', body: formData });
    setJobs(await res.json());
  };

  const getRoadmap = async (role) => {
    const formData = new FormData();
    formData.append('target_role', role);
    const res = await fetch('http://localhost:8000/api/roadmap', { method: 'POST', body: formData });
    setRoadmap(await res.json());
    setSelectedRole(role);
  };

  const getLearnWhy = async () => {
    const formData = new FormData();
    formData.append('subjects', learnSubjects);
    formData.append('target_role', selectedRole);
    const res = await fetch('http://localhost:8000/api/learnwhy', { method: 'POST', body: formData });
    setLearnWhy(await res.json());
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-serif font-bold text-gray-800">
            AGENTIC AI
          </h1>
          <p className="text-lg text-gray-600 font-medium">Intelligent Career Development Assistant</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mb-12">
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-8 text-center">Career Profile Analysis</h2>
          
          <form onSubmit={analyzeProfile} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Technical Skills</label>
              <input name="skills" className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-white text-gray-800" placeholder="Python, Data Structures..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Interests</label>
              <input name="interests" className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-white text-gray-800" placeholder="AI, Web Development..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Education</label>
              <input name="education" className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-200 focus:border-green-300 bg-white text-gray-800" placeholder="B.Tech CSE" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Target Role</label>
              <input name="target_role" className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white text-gray-800" placeholder="Software Engineer" required />
            </div>
            <button type="submit" disabled={loading} className="md:col-span-2 mt-8 bg-gradient-to-r from-gray-800 to-slate-800 hover:from-gray-900 text-white py-5 rounded-2xl font-serif font-semibold text-xl shadow-xl hover:shadow-2xl transition-all">
              {loading ? "Analyzing..." : "Start Career Analysis"}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-12 text-center">
            <h3 className="text-xl font-semibold text-red-800 mb-2">{error}</h3>
            <p className="text-red-700">Check Terminal 1: uvicorn app.main:app --port 8000</p>
          </div>
        )}

        {/* Profile Results */}
        {profile && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-semibold text-gray-800">Career Assessment</h2>
                <p className="text-lg text-gray-600">{profile.summary}</p>
              </div>
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                {profile.fit_score}%
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-serif font-semibold text-emerald-700 mb-6">Strengths</h3>
                <div className="space-y-4">
                  {profile.strengths.map((strength, i) => (
                    <div key={i} className="p-6 bg-emerald-50 border-l-4 border-emerald-400 rounded-2xl hover:bg-emerald-100 transition-all">
                      <span className="font-bold text-emerald-600 mr-3">✓</span>
                      <span className="text-gray-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-semibold text-amber-700 mb-6">Skill Gaps</h3>
                <div className="space-y-4">
                  {profile.gaps.map((gap, i) => (
                    <div key={i} className="p-6 bg-amber-50 border-l-4 border-amber-400 rounded-2xl hover:bg-amber-100 transition-all">
                      <span className="font-bold text-amber-600 mr-3">⚡</span>
                      <span className="text-gray-800">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!jobs && (
              <div className="text-center pt-8 border-t border-gray-200">
                <button onClick={getJobs} className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white font-serif font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                  Get Job Recommendations
                </button>
              </div>
            )}
          </div>
        )}

        {/* Jobs */}
        {jobs && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mb-12">
            <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-8 text-center">Recommended Roles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {jobs.recommended_roles.map((job, i) => (
                <div key={i} className="hover:shadow-xl transition-all rounded-2xl p-8 border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">{job.title}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full shadow-sm" style={{width: `${job.fit}%`}} />
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{job.why}</p>
                  <div className="bg-indigo-100 p-3 rounded-xl mb-6">
                    <span className="font-semibold text-indigo-800 block mb-1">Next Steps:</span>
                    <span className="text-indigo-700">{job.next_steps}</span>
                  </div>
                  <button onClick={() => getRoadmap(job.title)} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                    Create {job.title} Roadmap
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap */}
        {roadmap && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mb-12">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-serif font-semibold text-gray-800">{selectedRole}</h2>
                <p className="text-lg text-gray-600">4-Week Personalized Roadmap</p>
              </div>
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex flex-col items-center justify-center text-white font-bold text-xl shadow-xl">
                <div>📅</div>
                <div className="text-sm mt-1 font-normal">Ready</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {roadmap.weeks.map((week, i) => (
                <div key={i} className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-5 shadow-lg">
                      {week.week}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-gray-800">{week.focus}</h3>
                      <p className="text-gray-600">Week {week.week}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {week.tasks.map((task, j) => (
                      <li key={j} className="flex items-start p-3 bg-white/50 rounded-xl hover:bg-white transition-all">
                        <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-xs mr-4 mt-0.5 flex-shrink-0">→</div>
                        <span className="text-gray-800 font-medium">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LearnWhy Input - FIXED */}
        {roadmap && !learnWhy && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mb-12">
            <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6 text-center">LearnWhy - Syllabus Mapping</h3>
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 items-end">
              <input 
                type="text" 
                value={learnSubjects}
                onChange={(e) => setLearnSubjects(e.target.value)}
                placeholder="Data Structures, DBMS, OS, Networks..."
                className="flex-1 p-4 border-2 border-gray-300 rounded-2xl text-lg font-semibold bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-gray-800"
              />
              <button 
                onClick={getLearnWhy}
                className="px-12 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white font-serif font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all whitespace-nowrap"
              >
                Map Syllabus to {selectedRole}
              </button>
            </div>
          </div>
        )}

        {/* LearnWhy Results - FIXED */}
        {learnWhy && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10">
            <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-8 text-center">Syllabus → Career Mapping</h2>
            <p className="text-lg text-gray-700 text-center mb-12 font-medium">{learnWhy.subjects_analyzed} subjects analyzed for {learnWhy.target_role}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {learnWhy.explanations.map((item, i) => (
                <div key={i} className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all hover:bg-gray-50">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg flex-shrink-0">
                      {item.subject.split(' ')[0][0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xl font-bold text-gray-800 mb-3">{item.subject}</h4>
                      <p className="text-amber-800 font-semibold mb-4 bg-amber-50 p-3 rounded-xl text-sm">{item.relevance}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-gray-800 font-semibold text-lg block mb-3">Skills Gained:</span>
                      <div className="flex flex-wrap gap-2">
                        {item.skills_gained?.map((skill, j) => (
                          <span key={j} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold border border-amber-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {item.career_value && (
                      <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                        <span className="text-blue-800 font-semibold block mb-2">Career Value:</span>
                        <p className="text-gray-800 text-sm">{item.career_value}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6 rounded-xl shadow-sm">
                    <span className="text-emerald-800 font-bold text-lg block mb-3">🎯 Mini Project:</span>
                    <span className="text-gray-800 font-semibold text-base">{item.project_idea}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
