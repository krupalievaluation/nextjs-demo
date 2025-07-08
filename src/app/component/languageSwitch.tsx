"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const t = useTranslations("menu");

  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    // Read the current locale from the cookie (client-side only)
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
    const locale = match ? match[1] : "en";
    setCurrentLocale(locale);
    handleLocaleChange(locale);
  }, []);

  const handleLocaleChange = (value: string) => {
    const newLocale = value;
    document.cookie = `locale=${newLocale}; path=/`; // set locale cookie
    router.refresh(); // re-renders layout.tsx and reloads translations

    setCurrentLocale(newLocale);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <label className="text-sm text-muted-foreground text-[16px]">
          {t("language")}
        </label>
        <Select onValueChange={handleLocaleChange} value={currentLocale}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t("langEng")}</SelectItem>
            <SelectItem value="hi">{t("langHin")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
