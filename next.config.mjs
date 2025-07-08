import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl("./next-intl.config.ts");

export default withNextIntl({
  experimental: {
    serverActions: true
  },
  i18n: {
    locales: ["en", "hi"],
    defaultLocale: "en"
  }
});
