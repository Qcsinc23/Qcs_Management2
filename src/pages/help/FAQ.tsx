import React, { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general')

  const faqItems: FAQItem[] = [
    // General Questions
    {
      category: 'general',
      question: 'What is QCS Management?',
      answer: 'QCS Management is a comprehensive logistics and delivery management platform that helps businesses streamline their shipping operations and manage deliveries efficiently.',
    },
    {
      category: 'general',
      question: 'How do I get started?',
      answer: 'You can get started by signing up for an account, completing the onboarding process, and setting up your delivery preferences. Our system will guide you through each step.',
    },

    // Shipping & Delivery
    {
      category: 'shipping',
      question: 'What shipping options are available?',
      answer: 'We offer various shipping options including same-day delivery, next-day delivery, and standard shipping. Options may vary based on your location and package specifications.',
    },
    {
      category: 'shipping',
      question: 'How do I track my shipment?',
      answer: 'You can track your shipment using the tracking number provided in your confirmation email. Simply enter it in the tracking section of our website or app.',
    },

    // Billing & Payments
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, bank transfers, and digital payment methods. Corporate accounts may also qualify for invoice-based billing.',
    },
    {
      category: 'billing',
      question: 'How does pricing work?',
      answer: 'Our pricing is based on factors including distance, package size, delivery speed, and any additional services required. You can get an instant quote using our booking system.',
    },

    // Account Management
    {
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'You can update your account information through the Profile section. This includes contact details, delivery preferences, and notification settings.',
    },
    {
      category: 'account',
      question: 'Can I have multiple users on one account?',
      answer: 'Yes, corporate accounts can have multiple users with different permission levels. Contact our support team to set up additional users.',
    },
  ]

  const categories = Array.from(new Set(faqItems.map(item => item.category)))

  const categoryLabels: { [key: string]: string } = {
    general: 'General Questions',
    shipping: 'Shipping & Delivery',
    billing: 'Billing & Payments',
    account: 'Account Management',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {categories.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                  ${selectedCategory === category
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-6">
        {faqItems
          .filter(item => item.category === selectedCategory)
          .map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600">
                {item.answer}
              </p>
            </div>
          ))}
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Can't find what you're looking for?
        </h2>
        <p className="text-gray-600 mb-4">
          Our support team is here to help. Contact us for personalized assistance.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}

export default FAQ
