'use client';

import Link from 'next/link';
import React from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeAchievements() {
  const { t } = useLanguage();

  const achievements = [
    {
      id: 1,
      icon: (
        <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
      count: '10,000+',
      label: t('home.customers'),
      description: t('home.customersDescription')
    },
    {
      id: 2,
      icon: (
        <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
        </svg>
      ),
      count: '30+',
      label: t('home.softwareSolutions'),
      description: t('home.solutionsDescription')
    },
    {
      id: 3,
      icon: (
        <svg className="h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M9.315 2.1c.663 0 1.32.087 1.946.254C14.5 1.817 17.52 2.119 19.388 3.036c1.05.517 1.173 1.146 1.087 1.486-.247.972-1.564 1.54-3.161 1.197a19.096 19.096 0 00-1.138-3.255c-.855.169-1.711.615-2.398 1.307a18.167 18.167 0 00-2.157-1.128c-.146.471-.4.824-.746 1.08-.072 1.249.383 2.289.841 3.483l.034.087c.894.471 1.561 1.123 1.946 1.89 1.231-.283 2.495-.038 3.366.704.301.255.513.621.513 1.029 0 1.117-.947 1.996-2.02 1.996-1.04 0-1.956-.809-2.03-1.882-1.031-.523-2.119-.92-2.95-1.133.512-.82.78-1.705.78-2.618 0-1.183-.512-2.339-1.384-3.098-.87-.76-2.072-1.146-3.29-1.073-.236.014-.468.024-.672.075a3.345 3.345 0 01-.707-.178z" clipRule="evenodd" />
          <path d="M4.326 6.955c-1.196.822-1.256 2.396-.933 3.158.4.964 1.752 1.527 3.305 1.007 1.133-.38 2.035-1.41 2.459-2.628.276-.798.39-1.775.224-2.58-.229.279-.489.506-.777.679-.88.053-.18.121-.28.173a4.129 4.129 0 01-2.768.302c-.343-.074-.668-.161-.952-.264zm2.457 10.047c1.172 0 2.013-.823 2.013-1.834 0-.905-.66-1.607-1.596-1.758l-.189.492c-.71-.001-1.4-.205-1.998-.602-.644-.44-1.058-1.046-1.244-1.743-.594.276-1.136.657-1.553 1.12a3.307 3.307 0 00-.728 3.041c.199.757.7 1.404 1.376 1.819.677.414 1.523.57 2.338.403.257-.053.509-.13.75-.229-.009.075-.004.149.002.222.072.935.88 1.675 1.913 1.769.506.046 1.02-.088 1.397-.404.473-.329.766-.863.766-1.444 0-1.02-.857-1.862-2.045-1.862-.285 0-.554.05-.783.14l-.315-.414c-.019-.025-.038-.05-.057-.075.184-.15.368-.292.558-.44l.179-.145.479.619c.233-.11.486-.19.755-.234v-.497c-.577.11-1.123.348-1.605.773zm.16 1.835a.816.816 0 01-.702.747.756.756 0 01-.594-.14.691.691 0 01-.26-.548c0-.381.238-.695.572-.825.285-.11.56-.067.66.014.1.082.147.223.147.4 0 .138.06.27.17.352z" />
        </svg>
      ),
      count: '5+',
      label: t('home.yearsExperience'),
      description: t('home.experienceDescription')
    }
  ];

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t('home.achievements')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <div className="mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{item.count}</h3>
                    <p className="text-gray-600 font-medium">{item.label}</p>
                  </div>
                  <p className="text-gray-700 mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 