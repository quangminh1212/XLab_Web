'use client';

import Link from 'next/link';
import { useState } from 'react';

import RichTextContent from '@/components/common/RichTextContent';
import { siteConfig } from '@/config/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';
export default function WarrantyPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    problem: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Mô phỏng gửi form thành công
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        phone: '',
        problem: '',
      });
    } catch (error) {
      setSubmitError(t('warranty.formError'));
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('warranty.title')}</h1>
          <p className="text-xl max-w-3xl">
            {t('warranty.subtitle')}
          </p>
        </div>
      </section>

      {/* Chính sách bảo hành và đổi trả */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Chính sách bảo hành */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('warranty.policyTitle')}</h2>
              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="text-gray-700">
                    <span className="font-medium block mb-1">{t('warranty.periodTitle')}</span>
                    <RichTextContent content={t('warranty.period', { days: 365 })} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="text-gray-700">
                    <span className="font-medium block mb-1">{t('warranty.processTitle')}</span>
                    <RichTextContent content={t('warranty.process')} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-lg">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="text-gray-700">
                    <span className="font-medium block mb-1">{t('warranty.conditionsTitle')}</span>
                    <RichTextContent content={t('warranty.conditions')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chính sách đổi trả */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('warranty.refundPolicyTitle')}</h2>
              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="text-gray-700">
                    <span className="font-medium block mb-1">{t('warranty.refundPeriodTitle')}</span>
                    <RichTextContent content={t('warranty.refundPeriod', { days: 7 })} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-lg mb-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="text-gray-700">
                    <span className="font-medium block mb-1">{t('warranty.refundConditionsTitle')}</span>
                    <RichTextContent content={t('warranty.refundConditions')} />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-lg">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="text-gray-700">
                    <span className="font-medium block mb-1">{t('warranty.refundProcessTitle')}</span>
                    <RichTextContent content={t('warranty.refundProcess')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Form & Info */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Warranty Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('warranty.supportRequestTitle')}</h2>
              {submitSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-4 shadow-sm">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-medium">{t('warranty.submitSuccess')}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  {submitError && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-6">
                      <p>{submitError}</p>
                    </div>
                  )}

                  <div className="mb-5">
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <label
                          htmlFor="name"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          {t('warranty.formName')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-colors"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="phone"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          {t('warranty.formPhone')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-colors"
                          placeholder="0912345678"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="problem"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      {t('warranty.formProblem')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="problem"
                      name="problem"
                      rows={5}
                      required
                      value={formData.problem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-colors"
                      placeholder={t('warranty.formProblemPlaceholder')}
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto text-white bg-primary-600 hover:bg-primary-700 rounded-lg px-8 py-3 transition-colors font-medium shadow-sm flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('warranty.formSubmitting')}
                        </>
                      ) : (
                        t('warranty.formSubmit')
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Warranty Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('warranty.contactInfoTitle')}</h2>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">Zalo/Hotline</p>
                        <p className="text-gray-600">{siteConfig.contact.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">Email</p>
                        <p className="text-gray-600">{siteConfig.contact.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">{t('warranty.address')}</p>
                        <p className="text-gray-600">{siteConfig.contact.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 font-medium">{t('warranty.workingHours')}</p>
                        <p className="text-gray-600">{siteConfig.contact.workingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg shadow-sm border border-primary-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('warranty.ourMission')}</h3>
                <p className="text-gray-700 mb-4">
                  {t('warranty.missionDescription')}
                </p>
                <div className="flex space-x-4 mt-4">
                  <Link
                    href="/contact"
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    {t('warranty.contactNow')}
                  </Link>
                  <Link
                    href="/faqs"
                    className="text-primary-600 hover:text-primary-800 font-medium"
                  >
                    {t('warranty.faq')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
