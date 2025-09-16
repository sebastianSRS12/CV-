'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface MobileNavProps {
  isAuthenticated?: boolean
  userEmail?: string
}

export function MobileNav({ isAuthenticated = false, userEmail }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMenu} />
      )}

      {/* Mobile menu */}
      <nav
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-16">
          {/* User info */}
          {isAuthenticated && userEmail && (
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{userEmail}</p>
            </div>
          )}

          {/* Navigation links */}
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/cv/new"
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Create CV
            </Link>
            <Link
              href="/templates"
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Templates
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Profile
            </Link>
            
            {isAuthenticated ? (
              <Link
                href="/api/auth/signout"
                className="block px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                onClick={toggleMenu}
              >
                Sign Out
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/signin"
                  className="block px-4 py-3 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
