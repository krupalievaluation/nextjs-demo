export async function getMessages(locale: string) {
  return (await import(`../src/locales/${locale}.json`)).default;
}
