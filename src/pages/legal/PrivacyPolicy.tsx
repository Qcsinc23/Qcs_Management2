import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = '2023-10-15'; // TODO: Update this date when making changes

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: {lastUpdated}</p>
      </div>
      
      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            QCS Management ("we", "our", "us") is committed to protecting your privacy. This 
            Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect several types of information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Personal Data:</strong> Name, email, phone number, shipping/billing addresses</li>
            <li><strong>Payment Information:</strong> Credit card details, billing information</li>
            <li><strong>Usage Data:</strong> IP address, browser type, pages visited, device information</li>
            <li><strong>Cookies and Tracking Data:</strong> See our <Link to="/cookie-policy" className="text-blue-600 hover:text-blue-800">Cookie Policy</Link></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Legal Basis for Processing</h2>
          <p className="text-gray-600 mb-4">
            We process your personal data based on:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Your consent (e.g., for marketing communications)</li>
            <li>Performance of a contract (e.g., processing your orders)</li>
            <li>Legal obligations (e.g., tax compliance)</li>
            <li>Legitimate interests (e.g., improving our services)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Process transactions and provide services</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about orders and services</li>
            <li>Comply with legal requirements</li>
            <li>Prevent fraud and enhance security</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Data Sharing and Disclosure</h2>
          <p className="text-gray-600 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Service providers (e.g., payment processors, shipping carriers)</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners with your consent</li>
            <li>Affiliates and subsidiaries</li>
          </ul>
          <p className="text-gray-600 mb-4">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">6. International Data Transfers</h2>
          <p className="text-gray-600 mb-4">
            Your information may be transferred to and maintained on computers located outside 
            your country. We ensure appropriate safeguards are in place for international 
            transfers, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>EU Standard Contractual Clauses</li>
            <li>Adequacy decisions</li>
            <li>Binding Corporate Rules</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Data Retention</h2>
          <p className="text-gray-600 mb-4">
            We retain your personal data only as long as necessary for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Providing services</li>
            <li>Legal obligations</li>
            <li>Resolving disputes</li>
            <li>Enforcing agreements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Under GDPR, CCPA, and other privacy laws, you have rights including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Data portability</li>
            <li>Restriction of processing</li>
            <li>Right to object</li>
            <li>Right to erasure</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Security Measures</h2>
          <p className="text-gray-600 mb-4">
            We implement robust security measures including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>SSL/TLS encryption</li>
            <li>Regular security audits</li>
            <li>Access controls</li>
            <li>Data minimization</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this policy periodically. We will notify you of significant changes 
            through our website or by email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            For privacy-related inquiries, please contact our Data Protection Officer at:
            <br />
            <a href="mailto:privacy@qcsmanagement.com" className="text-blue-600 hover:text-blue-800">
              privacy@qcsmanagement.com
            </a>
            <br />
            Or write to:
            <br />
            QCS Management
            <br />
            123 Privacy Lane
            <br />
            San Francisco, CA 94107
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
  );
};

export default PrivacyPolicy;
