import React from 'react';
import { Link } from 'react-router-dom';

const AccessibilityStatement: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Commitment</h2>
          <p className="text-gray-600 mb-4">
            QCS Management is committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for everyone,
            and applying the relevant accessibility standards.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conformance Status</h2>
          <p className="text-gray-600 mb-4">
            The Web Content Accessibility Guidelines (WCAG) defines requirements for
            designers and developers to improve accessibility for people with disabilities.
            It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p className="text-gray-600 mb-4">
            QCS Management is partially conformant with WCAG 2.1 level AA. Partially
            conformant means that some parts of the content do not fully conform to the
            accessibility standard.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accessibility Features</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Navigation</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Consistent navigation structure throughout the website</li>
                <li>Skip to main content link</li>
                <li>Proper heading hierarchy</li>
                <li>Descriptive link text</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Visual Design</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>High contrast color schemes</li>
                <li>Resizable text without loss of functionality</li>
                <li>Clear visual hierarchy and spacing</li>
                <li>Alternative text for images</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Forms and Interactive Elements</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Proper form labels and error messages</li>
                <li>Keyboard accessible functionality</li>
                <li>ARIA landmarks and attributes where appropriate</li>
                <li>Focus indicators for interactive elements</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assistive Technology</h2>
          <p className="text-gray-600 mb-4">
            Our website is designed to be compatible with the following assistive technologies:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
            <li>Screen magnification software</li>
            <li>Speech recognition software</li>
            <li>Keyboard-only navigation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Known Limitations</h2>
          <p className="text-gray-600 mb-4">
            While we strive to ensure accessibility across our platform, some content may
            have limitations:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>PDF documents may not be fully accessible</li>
            <li>Some older content may not meet current accessibility standards</li>
            <li>Third-party content may not follow the same accessibility standards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Feedback and Support</h2>
          <p className="text-gray-600 mb-4">
            We welcome your feedback on the accessibility of QCS Management. Please let us
            know if you encounter accessibility barriers:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Email: accessibility@qcsmanagement.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>
              Feedback form: Available through our{' '}
              <Link to="/contact" className="text-blue-600 hover:text-blue-800">
                Contact page
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Continuous Improvement</h2>
          <p className="text-gray-600">
            We are committed to continually improving the accessibility of our website and
            services. We regularly review our accessibility efforts and work to address any
            issues that are identified.
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          This statement was created on {new Date().toLocaleDateString()} using the W3C
          Accessibility Statement Generator Tool.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
