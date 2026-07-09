'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Dev<span className="text-indigo-500">Connect</span></h1>
        <div className="flex gap-3">
          {user ? (
            <>
              <span className="text-gray-400 text-sm self-center">{user.email}</span>
              <button onClick={handleLogout} className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">Log in</a>
              <a href="/signup" className="text-sm bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition">Sign up</a>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-4 py-32">
        <h2 className="text-5xl font-bold mb-4">
          Your Developer <span className="text-indigo-500">Identity</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mb-8">
          Showcase your projects, skills, and coding activity — all in one place. Built for developers, by developers.
        </p>
        {user ? (
          <a href="/profile" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition">
            View My Profile →
          </a>
        ) : (
          <div className="flex gap-4">
            <a href="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition">Get Started →</a>
            <a href="/login" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition">Log In</a>
          </div>
        )}
      </div>
    </div>
  )
}