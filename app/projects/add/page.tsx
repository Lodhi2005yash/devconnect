'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function AddProjectPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [techInput, setTechInput] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    tech_stack: [] as string[]
  })
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSave = async () => {
    if (!form.title.trim()) {
      setMessage('Title zaroori hai!')
      return
    }
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('projects')
      .insert({
        user_id: user?.id,
        title: form.title,
        description: form.description,
        github_url: form.github_url,
        live_url: form.live_url,
        tech_stack: form.tech_stack
      })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Project added successfully! ✅')
      setTimeout(() => router.push('/projects'), 1500)
    }
    setSaving(false)
  }

  const addTech = () => {
    const trimmed = techInput.trim()
    if (trimmed && !form.tech_stack.includes(trimmed)) {
      setForm({ ...form, tech_stack: [...form.tech_stack, trimmed] })
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setForm({ ...form, tech_stack: form.tech_stack.filter(t => t !== tech) })
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
      <nav style={{ borderBottom: '1px solid #1E2D45', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A1628', position: 'sticky', top: 0, zIndex: 10 }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}>
          Dev<span style={{ color: '#818CF8' }}>Connect</span>
        </a>
        <button
          onClick={() => router.push('/projects')}
          style={{ fontSize: '13px', background: 'transparent', color: '#94A3B8', border: '1px solid #2A3A52', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
          ← Back to Projects
        </button>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '28px', color: '#FFFFFF' }}>
          Add New Project
        </h2>

        <div style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Project Title *</label>
            <input
              style={inputStyle}
              placeholder="e.g. DevConnect"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="Project ke baare mein batao..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input
              style={inputStyle}
              placeholder="https://github.com/username/repo"
              value={form.github_url}
              onChange={e => setForm({ ...form, github_url: e.target.value })}
            />
          </div>

          {/* Live URL */}
          <div>
            <label style={labelStyle}>Live Demo URL</label>
            <input
              style={inputStyle}
              placeholder="https://myproject.vercel.app"
              value={form.live_url}
              onChange={e => setForm({ ...form, live_url: e.target.value })}
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label style={labelStyle}>Tech Stack</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="e.g. Next.js, Supabase"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTech()}
              />
              <button
                onClick={addTech}
                style={{ background: '#6366F1', color: 'white', border: 'none', padding: '11px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {form.tech_stack.map(tech => (
                <span key={tech} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                  {tech}
                  <span onClick={() => removeTech(tech)} style={{ cursor: 'pointer', color: '#6366F1', fontWeight: 700, fontSize: '14px' }}>×</span>
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
            {saving ? 'Saving...' : 'Add Project'}
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