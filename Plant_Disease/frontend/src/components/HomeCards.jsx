import React from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'

const HomeCards = () => {
  return (
    <section className="py-10">
      <div className="container-xl lg:container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-lg">
          <Card>
            <h2 className="text-2xl font-extrabold text-green-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              For Developers
            </h2>
            <p className="mt-3 mb-6 text-gray-600 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Browse our React jobs and start your career today.
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-green-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-green-800 transition-colors duration-200"
            >
              Browse Jobs
            </Link>
          </Card>

          <Card bg="bg-green-50">
            <h2 className="text-2xl font-extrabold text-green-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              For Employers
            </h2>
            <p className="mt-3 mb-6 text-gray-600 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              List your job to find the perfect developer for the role.
            </p>
            <Link
              to="/add-job"
              className="inline-block bg-green-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Add Job
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HomeCards
