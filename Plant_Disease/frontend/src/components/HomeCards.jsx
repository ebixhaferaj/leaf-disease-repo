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
              Upload Plant Images
            </h2>
            <p className="mt-3 mb-6 text-gray-600 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Easily upload images of your plants for disease analysis.
            </p>
            <Link
              to="/upload"
              className="inline-block bg-green-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-green-800 transition-colors duration-200"
            >
              Upload Now
            </Link>
          </Card>

          <Card bg="bg-green-50">
            <h2 className="text-2xl font-extrabold text-green-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              View Reports
            </h2>
            <p className="mt-3 mb-6 text-gray-600 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Check your plant health history and analysis reports.
            </p>
            <Link
              to="/reports"
              className="inline-block bg-green-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              View Reports
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}


export default HomeCards
