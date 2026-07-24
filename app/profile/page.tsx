'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import Navbar from '../components/Navbar'

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  github_username: string
  website: string
  skills: string[]
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)
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

      if (data) setProfile(data)

      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

      setProjectCount(count ?? 0)
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#4A5568', fontFamily: 'monospace' }}>Loading...</p>
      </div>
    )
  }

  const avatarLetter = profile?.full_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', color: '#F8FAFC', fontFamily: '-apple-system, Inter, BlinkMacSystemFont, sans-serif' }}>

      {/* Navbar */}
      <Navbar
  rightContent={
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ color: '#64748B', fontSize: '13px' }}>{user?.email}</span>
      <button onClick={handleLogout} style={{ fontSize: '13px', background: 'transparent', color: '#94A3B8', border: '1px solid #2A3A52', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer' }}>
        Log out
      </button>
    </div>
  }
/>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Profile Header */}
        <div style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '20px', padding: '36px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 700, flexShrink: 0, boxShadow: '0 0 0 3px rgba(99,102,241,0.25), 0 0 20px rgba(99,102,241,0.15)' }}>
              {avatarLetter}
            </div>

            {/* Info */}
            <div style={{ flex: 1, paddingTop: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                {profile?.full_name ?? 'No name set'}
              </div>
              <div style={{ fontSize: '12px', color: '#818CF8', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '6px', fontFamily: 'monospace' }}>
                @{profile?.username ?? 'username'}
              </div>
              <div style={{ fontSize: '13px', color: '#4A5568' }}>{user?.email}</div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={() => router.push('/profile/edit')}
                style={{ background: '#6366F1', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}
              >
                ✏️ Edit Profile
              </button>
              <a
                href="/projects"
                style={{ display: 'block', textAlign: 'center', background: 'transparent', color: '#818CF8', border: '1px solid #2A3A52', padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              >
                🚀 My Projects
              </a>
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #1A2840', color: '#94A3B8', fontSize: '14px', lineHeight: 1.75 }}>
            {profile?.bio ?? 'No bio added yet. Click Edit Profile to add one.'}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { num: String(projectCount), label: 'Projects' },
            { num: '0', label: 'Followers' },
            { num: '0', label: 'Posts' }
          ].map((s) => (
            <div key={s.label} style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '14px', padding: '22px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', fontWeight: 700, color: '#818CF8', letterSpacing: '-1px' }}>{s.num}</div>
              <div style={{ fontSize: '11px', color: '#4A5568', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '16px', padding: '26px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#3D5068', marginBottom: '16px', fontWeight: 700 }}>Skills & Tech Stack</div>
          {(profile?.skills?.length ?? 0) > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile?.skills?.map((skill: string) => (
                <span key={skill} style={{ fontSize: '12px', padding: '5px 13px', borderRadius: '20px', fontWeight: 500, fontFamily: 'monospace', background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: '#3D5068', fontSize: '13px', fontStyle: 'italic' }}>No skills added yet.</p>
          )}
        </div>

        {/* Links */}
        <div style={{ background: '#0F1C2E', border: '1px solid #1E2D45', borderRadius: '16px', padding: '26px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#3D5068', marginBottom: '16px', fontWeight: 700 }}>Links</div>
          {profile?.github_username ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: profile?.website ? '1px solid #131F30' : 'none' }}>
              <div style={{ width: '34px', height: '34px', background: '#162033', border: '1px solid #1E2D45', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>🐙</div>
              <div>
                <div style={{ fontSize: '11px', color: '#3D5068', marginBottom: '2px', fontWeight: 500 }}>GitHub</div>
                <a href={`https://github.com/${profile.github_username}`} target="_blank" style={{ fontSize: '13px', color: '#818CF8', textDecoration: 'none' }}>
                  github.com/{profile.github_username}
                </a>
              </div>
            </div>
          ) : (
            !profile?.website && <p style={{ color: '#3D5068', fontSize: '13px', fontStyle: 'italic' }}>No links added yet.</p>
          )}
          {profile?.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0' }}>
              <div style={{ width: '34px', height: '34px', background: '#162033', border: '1px solid #1E2D45', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>🌐</div>
              <div>
                <div style={{ fontSize: '11px', color: '#3D5068', marginBottom: '2px', fontWeight: 500 }}>Website</div>
                <a href={profile.website} target="_blank" style={{ fontSize: '13px', color: '#818CF8', textDecoration: 'none' }}>
                  {profile.website}
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}