"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import moment from "moment";

type feedback = {
  message: string;
  name?: string;
  email?: string;
  createdAt?: Date;
};

export default function AllFeedback() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 5;
  const t = useTranslations("feedbackList");
  const [date, setDate] = useState<Date | null>();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Load token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, []);

  // ✅ Fetch only if token is available
  useEffect(() => {
    if (token) {
      fetchFeedbacks(currentPage);
    }
  }, [token, date, currentPage]);

  const fetchFeedbacks = (page: number) => {
    const formattedDate = date ? moment(date).format("YYYY-MM-DD") : null;
    setIsLoading(true);
    fetch(
      formattedDate
        ? `/api/feedback?page=${page}&limit=${perPage}&date=${formattedDate}`
        : `/api/feedback?page=${page}&limit=${perPage}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data.feedbackList);
        setTotalPages(data.totalPages);
      })
      .catch(() => alert("Error fetching feedbacks"));
    // .finally(() => setIsLoading(false));
  };

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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

        <div>
          <label htmlFor="date" className="px-1">
            Date Filter:
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {date ? moment(date).format("DD MMM YYYY") : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date ? date : undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                  setCurrentPage(1);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
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
                  <TableHead>{t("createdAt")}</TableHead>
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
                      <TableCell className="px-5 py-3">
                        {new Date(f?.createdAt || "").toLocaleString() || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                {feedbacks?.length === 0 && (
                  <TableRow className="hover:bg-muted/50">
                    <TableCell
                      className="font-medium px-5 py-3 text-center"
                      colSpan={5}
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
          <Table className="bg-white mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>{t("message")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
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
