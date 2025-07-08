import FeedbackForm from "./feedbacks/page";
// import { useTranslations } from "next-intl";

export default function Home() {
  // const t = useTranslations("home");
  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      <FeedbackForm />
    </>
  );
}
