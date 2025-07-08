"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

type feedback = {
  message: string;
  name?: string;
  email?: string;
};

export default function AllFeedback() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 5;
  const t = useTranslations("feedbackList");

  useEffect(() => {
    const token = localStorage?.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchFeedbacks(currentPage);
  }, []);

  const fetchFeedbacks = (page: number) => {
    setIsLoading(true);
    fetch(`/api/feedback?page=${page}&limit=${perPage}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data.feedbackList);
        setTotalPages(data.totalPages);
      })
      .catch(() => alert("Error fetching feedbacks"));
    // .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {isLoading && (
        <>
          <div className="overflow-x-auto w-full mt-6 shadow rounded-lg bg-white ">
            <Table className="bg-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>{t("message")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks?.length > 0 &&
                  feedbacks?.map((f, i) => (
                    <TableRow key={i} className="hover:bg-muted/50">
                      <TableCell className="font-medium px-5 py-3">
                        {(currentPage - 1) * perPage + i + 1}
                      </TableCell>
                      <TableCell className="px-5 py-3">{f.message}</TableCell>
                      <TableCell className="px-5 py-3">
                        {f.name || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        {f.email || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                {feedbacks?.length === 0 && (
                  <TableRow className="hover:bg-muted/50">
                    <TableCell
                      className="font-medium px-5 py-3 text-center"
                      colSpan={4}
                    >
                      {t("noFeedback")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {feedbacks?.length > 0 && (
            <div className="mt-6 flex items-center justify-center text-sm">
              {/* Previous */}
              <Button
                onClick={handlePrev}
                disabled={currentPage === 1}
                variant="secondary"
                size="icon"
                className="size-8"
              >
                <ChevronLeftIcon />
              </Button>

              {/* Page Info */}
              <span className="mx-2">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                variant="secondary"
                size="icon"
                className="size-8"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          )}
        </>
      )}
      {!isLoading && (
        <>
          <Table className="bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>{t("message")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                  <TableCell className="font-medium px-5 py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
