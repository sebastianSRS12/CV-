import Link from 'next/link'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Pricing Plans
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Choose the perfect plan for your CV building needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-4 text-gray-500 dark:text-gray-300">Perfect for getting started</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
              </p>
              <Link
                href="/dashboard"
                className="mt-8 w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-4 border-indigo-500">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-4 text-gray-500 dark:text-gray-300">For serious professionals</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$9.99</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
              </p>
              <Link
                href="/dashboard"
                className="mt-8 w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise</h3>
              <p className="mt-4 text-gray-500 dark:text-gray-300">For teams and organizations</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$29.99</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
              </p>
              <Link
                href="/dashboard"
                className="mt-8 w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
