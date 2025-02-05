import React from 'react'
import { Link } from 'react-router-dom'

const SecurityPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Policy</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Commitment to Security</h2>
          <p className="text-gray-600 mb-4">
            At QCS Management, we take the security of your data seriously. We employ
            industry-standard security measures to protect your personal information,
            shipping details, and payment data from unauthorized access, disclosure,
            alteration, and destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Protection Measures</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Encryption</h3>
              <p className="text-gray-600">
                We use industry-standard SSL/TLS encryption to protect data transmission
                between your browser and our servers. All sensitive information, including
                payment details, is encrypted at rest using strong cryptographic algorithms.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Access Control</h3>
              <p className="text-gray-600">
                We implement strict access controls and authentication mechanisms to ensure
                that only authorized personnel can access sensitive information. All access
                attempts are logged and monitored.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Regular Security Audits</h3>
              <p className="text-gray-600">
                We conduct regular security assessments and penetration testing to identify
                and address potential vulnerabilities in our systems.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Security</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              All payment processing is handled through secure, PCI-DSS compliant payment
              processors.
            </li>
            <li>
              We never store complete credit card numbers or CVV codes on our servers.
            </li>
            <li>
              Payment information is encrypted using industry-standard protocols.
            </li>
            <li>
              Regular security scans and audits are performed to maintain PCI compliance.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Security</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              Multi-factor authentication is available and encouraged for all accounts.
            </li>
            <li>
              Password requirements enforce strong security practices.
            </li>
            <li>
              Account activity is monitored for suspicious behavior.
            </li>
            <li>
              Automatic account lockout after multiple failed login attempts.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Physical Security</h2>
          <p className="text-gray-600 mb-4">
            Our data centers and physical infrastructure are protected by:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>24/7 security personnel and surveillance</li>
            <li>Biometric access controls</li>
            <li>Environmental controls and monitoring</li>
            <li>Redundant power and networking systems</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Security Incident Response</h2>
          <p className="text-gray-600 mb-4">
            We maintain a comprehensive incident response plan that includes:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>24/7 monitoring for security incidents</li>
            <li>Rapid response procedures for potential security breaches</li>
            <li>Regular testing of incident response procedures</li>
            <li>Prompt notification of affected users in case of a security breach</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reporting Security Concerns</h2>
          <p className="text-gray-600 mb-4">
            If you discover a security vulnerability or have security concerns, please
            contact our security team immediately at security@qcsmanagement.com. We take
            all security reports seriously and will investigate promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
          <p className="text-gray-600">
            We regularly review and update our security practices to maintain the highest
            levels of protection. This policy may be updated to reflect these improvements.
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-600">
          Last updated:
          {' '}
          {new Date().toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          For more information about our security practices or to report concerns, please
          {' '}
          <Link to="/contact" className="text-blue-600 hover:text-blue-800">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default SecurityPolicy
