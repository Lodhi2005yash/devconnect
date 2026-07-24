'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import Navbar from '../../components/Navbar'

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  github_username: string
  website: string
  skills: string[]
}

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState<Profile>({
    id: '',
    username: '',
    full_name: '',
    bio: '',
    github_username: '',
    website: '',
    skills: []
  })
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) setForm(data)
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        username: form.username,
        full_name: form.full_name,
        bio: form.bio,
        github_username: form.github_username,
        website: form.website,
        skills: form.skills
      })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Profile updated successfully! ✅')
      setTimeout(() => router.push('/profile'), 1500)
    }
    setSaving(false)
  }

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm({ ...form, skills: [...form.skills, trimmed] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) })
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#4A5568' }}>Loading...</p>
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    background: '#0A1628',
    border: '1px solid #1E2D45',
    borderRadius: '10px',
    padding: '11px 14px',
    color: '#F8FAFC',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit'
  }

  const labelStyle = {
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: '#3D5068',
    fontWeight: 700,
    marginBottom: '8px',
    display: 'block'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', color: '#F8FAFC', fontFamily: '-apple-system, Inter, BlinkMacSystemFont, sans-serif' }}>

      {/* Navbar */}
     <Navbar backHref="/profile" backLabel="Back to Profile" />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '28px', color: '#FFFFFF' }}>Edit Profile</h2>

        <div style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              placeholder="Yash Lodhi"
              value={form.full_name ?? ''}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
            />
          </div>

          {/* Username */}
          <div>
            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle}
              placeholder="yash_dev"
              value={form.username ?? ''}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="Full-stack developer building cool things..."
              value={form.bio ?? ''}
              onChange={e => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {/* GitHub */}
          <div>
            <label style={labelStyle}>GitHub Username</label>
            <input
              style={inputStyle}
              placeholder="yashdev"
              value={form.github_username ?? ''}
              onChange={e => setForm({ ...form, github_username: e.target.value })}
            />
          </div>

          {/* Website */}
          <div>
            <label style={labelStyle}>Website</label>
            <input
              style={inputStyle}
              placeholder="https://yashdev.in"
              value={form.website ?? ''}
              onChange={e => setForm({ ...form, website: e.target.value })}
            />
          </div>

          {/* Skills */}
          <div>
            <label style={labelStyle}>Skills</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="e.g. React, Node.js, SQL"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                style={{ background: '#6366F1', color: 'white', border: 'none', padding: '11px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {form.skills.map(skill => (
                <span key={skill} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                  {skill}
                  <span onClick={() => removeSkill(skill)} style={{ cursor: 'pointer', color: '#6366F1', fontWeight: 700, fontSize: '14px' }}>×</span>
                </span>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: '#6366F1', color: 'white', border: 'none', padding: '13px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {message && (
            <p style={{ textAlign: 'center', fontSize: '13px', color: message.includes('✅') ? '#4ADE80' : '#F87171' }}>
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  )
}