import React from 'react';
import { render } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

function Probe() {
  const { t } = useLanguage();
  // Should return the key when missing
  return <div data-testid="value">{t('nonexistent.key')}</div>;
}

test('LanguageContext.t returns key when missing', () => {
  const { getByTestId } = render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>
  );
  expect(getByTestId('value').textContent).toBe('nonexistent.key');
});

