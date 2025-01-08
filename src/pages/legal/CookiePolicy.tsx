import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your computer or mobile device when
            you visit our website. They are widely used to make websites work more efficiently
            and provide a better user experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
          <p className="text-gray-600 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Required for the website to function properly,
              including authentication and security.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> Help us remember your preferences and
              settings for a better user experience.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Allow us to understand how visitors interact
              with our website, helping us improve our services.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Help us understand and analyze the performance
              of our website and any errors that occur.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Session Cookies</h3>
              <p className="text-gray-600">
                Temporary cookies that expire when you close your browser. These help us track
                your movements from page to page so you don't have to repeatedly enter the
                same information.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Persistent Cookies</h3>
              <p className="text-gray-600">
                Remain on your device until they expire or you delete them. These help us
                remember your preferences for future visits.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Third-Party Cookies</h3>
              <p className="text-gray-600">
                Placed by third-party services we use, such as analytics or advertising
                partners. These help us understand user behavior and improve our services.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
          <p className="text-gray-600 mb-4">
            Most web browsers allow you to control cookies through their settings preferences.
            However, limiting cookies may impact your experience using our website.
          </p>
          <p className="text-gray-600 mb-4">
            To manage cookies in your browser:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
            <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
            <li>Safari: Preferences → Privacy → Cookies and website data</li>
            <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
          <p className="text-gray-600">
            We may update this Cookie Policy from time to time. Any changes will be posted
            on this page with an updated revision date. Please check back periodically for
            any updates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about our Cookie Policy, please{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-800">
              contact us
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
