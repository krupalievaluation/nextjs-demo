// import { getRequestConfig } from "next-intl/server";
// import type { RequestConfig } from "next-intl/server";

// export default getRequestConfig(async ({ locale }): Promise<RequestConfig> => {
//   const currentLocale = locale ?? "hi"; // fallback
//   return {
//     locale: currentLocale,
//     messages: (await import(`./src/locales/${currentLocale}.json`)).default
//   };
// });
import { getRequestConfig } from "next-intl/server";
import type { RequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async (): Promise<RequestConfig> => {
  const cookieStore = await cookies(); // ✅ await this

  const currentLocale = cookieStore.get("locale")?.value || "en"; // fallback

  return {
    locale: currentLocale,
    messages: (await import(`./src/locales/${currentLocale}.json`)).default
  };
});
