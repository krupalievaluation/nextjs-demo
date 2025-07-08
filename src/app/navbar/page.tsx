"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import LanguageSwitcher from "../component/languageSwitch";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const t = useTranslations("menu");

  // const isLoggedIn = localStorage?.getItem("token") || false;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navStyle = (path: string) =>
    pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-lg font-bold text-blue-700">{t("title")}</div>
      {/* <div className="space-x-4">
        <LanguageSwitcher />
      </div> */}
      <div className="space-x-4">
        <Link href="/" className={navStyle("/")}>
          {t("home")}
        </Link>
        {/* {!isLoggedIn && (
          <>
            <Link href="/register" className={navStyle("/register")}>
              Register
            </Link>
          </>
        )} */}
        {!isLoggedIn && (
          <Link href="/login" className={navStyle("/login")}>
            {t("login")}
          </Link>
        )}
        {isLoggedIn && (
          <>
            <Link
              href="/feedbacks/list"
              className={navStyle("/feedbacks/list")}
            >
              {t("feedbackList")}
            </Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <button
              onClick={logout}
              className="text-red-600 font-semibold ml-2"
            >
              {t("logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
