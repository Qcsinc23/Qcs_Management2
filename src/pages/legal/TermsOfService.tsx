import React from 'react'
import { Link } from 'react-router-dom'

const TermsOfService: React.FC = () => {
  const lastUpdated = '2023-10-15' // TODO: Update this date when making changes

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500">
          Last updated:
          {lastUpdated}
        </p>
      </div>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using QCS Management's services, you confirm that you are at least
            18 years old and agree to be bound by these Terms of Service. If you are accessing
            our services on behalf of an organization, you represent that you have the authority
            to bind that organization to these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Account Registration</h2>
          <p className="text-gray-600 mb-4">
            You must provide accurate and complete information when creating an account.
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Use License</h2>
          <p className="text-gray-600 mb-4">
            We grant you a limited, non-exclusive, non-transferable license to access and use
            our services for your personal or internal business purposes. This license does not
            include any resale or commercial use of our services or their contents.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Prohibited Activities</h2>
          <p className="text-gray-600 mb-4">
            You agree not to:
            <ul className="list-disc pl-6 mt-2">
              <li>Use our services for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the integrity or performance of our services</li>
              <li>Reverse engineer, decompile, or disassemble any part of our services</li>
            </ul>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            All content and materials available through our services, including but not limited
            to text, graphics, logos, and software, are the property of QCS Management or its
            licensors and are protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Disclaimer</h2>
          <p className="text-gray-600 mb-4">
            Our services are provided "as is" without warranties of any kind, either express or
            implied. We do not guarantee that our services will be uninterrupted, secure, or
            error-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            To the maximum extent permitted by law, QCS Management shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or any loss of
            profits or revenues, whether incurred directly or indirectly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Governing Law</h2>
          <p className="text-gray-600 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the
            State of California, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of
            significant changes through our website or by email. Your continued use of our
            services after such changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            For questions about these Terms, please contact us at:
            <br />
            <a href="mailto:legal@qcsmanagement.com" className="text-blue-600 hover:text-blue-800">
              legal@qcsmanagement.com
            </a>
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default TermsOfService
