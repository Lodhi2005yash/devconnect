'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

interface NavbarProps {
  backHref?: string
  backLabel?: string
  rightContent?: React.ReactNode
}

export default function Navbar({ backHref, backLabel, rightContent }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{ borderBottom: '1px solid #1E2D45', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A1628', position: 'sticky', top: 0, zIndex: 10 }}>
      <a href="/" style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}>
        Dev<span style={{ color: '#818CF8', textShadow: '0 0 20px rgba(129,140,248,0.5)' }}>Connect</span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {backHref && (
          <button
            onClick={() => router.push(backHref)}
            style={{ fontSize: '13px', background: 'transparent', color: '#94A3B8', border: '1px solid #2A3A52', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer' }}
          >
            ← {backLabel ?? 'Back'}
          </button>
        )}
        {rightContent}
      </div>
    </nav>
  )
}