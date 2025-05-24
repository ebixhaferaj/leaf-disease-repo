import React from 'react'
import Card from './Card'

const HomeCards = () => {
  return (
    <section className="py-10">
      <div className="container-xl lg:container mx-auto px-4">
        <h2
          className="text-center text-4xl font-extrabold text-leaf-900 tracking-wide mb-10 border-b-2 border-leaf-600 pb-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Card */}
          <Card>
            <h3 className="text-2xl font-extrabold text-green-800 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              User Features
            </h3>
            <ul className="list-disc list-inside text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li>Upload plant images for disease analysis</li>
              <li>View individual plant health reports</li>
              <li>Get quick disease detection results</li>
              <li>Access basic plant care suggestions</li>
            </ul>
          </Card>

          {/* Farmer Card */}
          <Card bg="bg-green-50">
            <h3 className="text-2xl font-extrabold text-green-800 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Farmer Features
            </h3>
            <ul className="list-disc list-inside text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li>Upload multiple plant images at once</li>
              <li>Generate detailed farm-wide disease reports</li>
              <li>Receive pesticide and treatment suggestions</li>
              <li>Save and review past analysis reports</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HomeCards
