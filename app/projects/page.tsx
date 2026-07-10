'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface Project {
  id: string
  title: string
  description: string
  github_url: string
  live_url: string
  tech_stack: string[]
  created_at: string
}

export default function ProjectsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (data) setProjects(data)
      setLoading(false)
    }
    getData()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#4A5568' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', color: '#F8FAFC', fontFamily: '-apple-system, Inter, BlinkMacSystemFont, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #1E2D45', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A1628', position: 'sticky', top: 0, zIndex: 10 }}>
        <a href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}>
          Dev<span style={{ color: '#818CF8' }}>Connect</span>
        </a>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/profile" style={{ fontSize: '13px', background: 'transparent', color: '#94A3B8', border: '1px solid #2A3A52', padding: '7px 16px', borderRadius: '8px', textDecoration: 'none' }}>
            Profile
          </a>
          <a href="/projects/add" style={{ fontSize: '13px', background: '#6366F1', color: 'white', border: 'none', padding: '7px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            + Add Project
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>My Projects</h2>
            <p style={{ color: '#4A5568', fontSize: '13px', marginTop: '4px' }}>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>No projects yet</h3>
            <p style={{ color: '#4A5568', fontSize: '14px', marginBottom: '24px' }}>Add your first project to showcase your work</p>
            <a href="/projects/add" style={{ background: '#6366F1', color: 'white', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              + Add First Project
            </a>
          </div>
        ) : (
          /* Projects Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
            {projects.map(project => (
              <div key={project.id} style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Title */}
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>{project.title}</h3>

                {/* Description */}
                {project.description && (
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
                    {project.description.length > 120 ? project.description.slice(0, 120) + '...' : project.description}
                  </p>
                )}

                {/* Tech Stack */}
                {project.tech_stack?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {project.tech_stack.map(tech => (
                      <span key={tech} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'monospace' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" style={{ fontSize: '12px', color: '#818CF8', textDecoration: 'none', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '6px 14px', borderRadius: '8px' }}>
                      🐙 GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" style={{ fontSize: '12px', color: '#4ADE80', textDecoration: 'none', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', padding: '6px 14px', borderRadius: '8px' }}>
                      🌐 Live Demo
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}