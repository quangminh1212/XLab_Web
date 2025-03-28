'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { translate } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your backend
    alert(translate('contact.messageSent'))
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{translate('contact.pageTitle')}</h1>
          <p className="text-xl max-w-3xl">
            {translate('contact.pageDescription')}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">{translate('contact.sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('contact.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('contact.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('contact.subject')}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                    >
                      <option value="">{translate('contact.selectSubject')}</option>
                      <option value="general">{translate('contact.generalInquiry')}</option>
                      <option value="support">{translate('contact.technicalSupport')}</option>
                      <option value="sales">{translate('contact.salesInquiry')}</option>
                      <option value="partnership">{translate('contact.partnership')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-secondary-500 focus:border-secondary-500"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    {translate('contact.send')}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">{translate('contact.contactInfo')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{translate('contact.address')}</h3>
                  <p className="text-gray-600">
                    123 Tech Street, District 1<br />
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{translate('contact.phone')}</h3>
                  <p className="text-gray-600">
                    +84 (0)28 1234 5678<br />
                    +84 (0)90 1234 567
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{translate('contact.email')}</h3>
                  <p className="text-gray-600">
                    info@xlab.vn<br />
                    support@xlab.vn
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{translate('contact.businessHours')}</h3>
                  <p className="text-gray-600">
                    {translate('contact.weekdays')}: 8:30 AM - 6:00 PM<br />
                    {translate('contact.weekend')}: {translate('contact.closed')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6 text-center">{translate('contact.findUs')}</h2>
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            {/* You would typically insert a map here */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-600">{translate('contact.mapPlaceholder')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 