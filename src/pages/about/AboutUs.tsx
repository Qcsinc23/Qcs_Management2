import React from 'react'

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About QCS Management</h1>

      {/* Mission Statement */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At QCS Management, we're dedicated to revolutionizing logistics and delivery services
          through innovative technology and exceptional customer service. Our mission is to provide
          seamless, efficient, and reliable delivery solutions that empower businesses and delight
          customers.
        </p>
      </section>

      {/* Company Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We continuously strive to improve and innovate our services, leveraging
              cutting-edge technology to solve complex logistics challenges.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Reliability</h3>
            <p className="text-gray-600">
              We understand the importance of timely deliveries and maintain the highest
              standards of reliability in all our operations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Focus</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We're committed to
              providing exceptional service and support at every step.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Sustainability</h3>
            <p className="text-gray-600">
              We're committed to environmentally responsible practices and continuously
              work to reduce our carbon footprint.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-gray-600">
              Advanced tracking and real-time visibility of your shipments
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-gray-600">
              Dedicated customer support team available 24/7
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-gray-600">
              Flexible delivery options to meet your specific needs
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="ml-3 text-gray-600">
              Competitive pricing with no hidden fees
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
            <div className="text-sm text-gray-600">Deliveries Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">50k+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-sm text-gray-600">Cities Served</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
            <div className="text-sm text-gray-600">On-Time Delivery</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of satisfied customers who trust QCS Management for their delivery needs.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Contact Sales
        </button>
      </section>
    </div>
  )
}

export default AboutUs
