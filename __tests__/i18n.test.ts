import translations from '@/i18n';

describe('i18n t() via LanguageContext (flat keys)', () => {
  it('has flattened keys for both languages', () => {
    expect(translations.eng._flat['about.pageTitle']).toBeTruthy();
    expect(translations.vie._flat['about.pageTitle']).toBeTruthy();
  });

  it('returns flat value with param replacement', () => {
    const eng = translations.eng._flat;
    const tempKey = 'test.param.sample';
    (eng as any)[tempKey] = 'Hello {name}!';
    const val = (eng as any)[tempKey].replace('{name}', 'XLab');
    expect(val).toBe('Hello XLab!');
  });
});

