"use client";
import { getCars } from "@/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CarListingsLoading from "./car-listings-loading";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import CarCard from "@/components/car-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CarListings = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const transmission = searchParams.get("transmission") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  const { loading, fn: fetchCars, data: result, error } = useFetch(getCars);

  useEffect(() => {
    fetchCars({
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    });
    setCurrentPage(page);
  }, [search, make, bodyType, fuelType, transmission, minPrice, maxPrice, sortBy, page]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const getPaginationUrl = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  if (loading && !result) {
    return <CarListingsLoading />;
  }

  if (error || (!result || !result.success)) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load cars. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!result || !result.data) {
    return null;
  }

  const { data: cars, pagination } = result;

  // Map backend 'pages' to frontend 'totalPages'
  const fixedPagination = {
    ...pagination,
    totalPages: pagination.pages,
  };

  if (cars.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Info className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No cars found</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find any cars matching your search criteria. Try adjusting your filters or search term.
        </p>
        <Button variant="outline" asChild>
          <Link href="/cars">Clear all filters</Link>
        </Button>
      </div>
    );
  }

  const PaginationItems = [];
  const visiblePages = new Set();
  visiblePages.add(1);

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(fixedPagination.totalPages - 1, currentPage + 1);
    i++
  ) {
    visiblePages.add(i);
  }

  if (fixedPagination.totalPages > 1) {
    visiblePages.add(fixedPagination.totalPages);
  }

  const sortedPages = Array.from(visiblePages).sort((a, b) => a - b);
  let lastPage = 0;

  sortedPages.forEach((pageNum) => {
    if (pageNum - lastPage > 1) {
      PaginationItems.push(
        <PaginationItem key={`ellipsis-${pageNum}`}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    PaginationItems.push(
      <PaginationItem key={pageNum}>
        <PaginationLink
          href={getPaginationUrl(pageNum)}
          isActive={pageNum === currentPage}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNum);
          }}
        >
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    );

    lastPage = pageNum;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, fixedPagination.total)}
          </span>{" "}
          of <span className="font-medium">{fixedPagination.total}</span> Cars
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {fixedPagination.totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPaginationUrl(currentPage - 1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {PaginationItems}
            <PaginationItem>
              <PaginationNext
                href={getPaginationUrl(currentPage + 1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < fixedPagination.totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={
                  currentPage >= fixedPagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CarListings;
