"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Filter, Sliders, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarFilterControls } from "./filter-control";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const CarFilters = ({ filtersData }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get current filter values from searchParams
    const currentMake = searchParams.get("make") || "";
    const currentBodyType = searchParams.get("bodyType") || "";
    const currentFuelType = searchParams.get("fuelType") || "";
    const currentTransmission = searchParams.get("transmission") || "";
    const currentMinPrice = searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice"))
        : filtersData.priceRange.min;
    const currentMaxPrice = searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice"))
        : filtersData.priceRange.max;
    const currentSortBy = searchParams.get("sortBy") || "newest";

    // Local state for filters
    const [make, setMake] = useState(currentMake);
    const [bodyType, setBodyType] = useState(currentBodyType);
    const [fuelType, setFuelType] = useState(currentFuelType);
    const [transmission, setTransmission] = useState(currentTransmission);
    const [priceRange, setPriceRange] = useState([
        currentMinPrice,
        currentMaxPrice,
    ]);
    const [sortBy, setSortBy] = useState(currentSortBy);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Update local state when URL parameters change
    useEffect(() => {
        setMake(currentMake);
        setBodyType(currentBodyType);
        setFuelType(currentFuelType);
        setTransmission(currentTransmission);
        setPriceRange([currentMinPrice, currentMaxPrice]);
        setSortBy(currentSortBy);
    }, [
        currentMake,
        currentBodyType,
        currentFuelType,
        currentTransmission,
        currentMinPrice,
        currentMaxPrice,
        currentSortBy,
    ]);

    // Count active filters
    const activeFilterCount = [
        make,
        bodyType,
        fuelType,
        transmission,
        currentMinPrice > filtersData.priceRange.min ||
        currentMaxPrice < filtersData.priceRange.max,
    ].filter(Boolean).length;

    // Current filters object for the controls component
    const currentFilters = {
        make,
        bodyType,
        fuelType,
        transmission,
        priceRange,
        priceRangeMin: filtersData.priceRange.min,
        priceRangeMax: filtersData.priceRange.max,
    };

    // Update URL when filters change
    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();

        if (make) params.set("make", make);
        if (bodyType) params.set("bodyType", bodyType);
        if (fuelType) params.set("fuelType", fuelType);
        if (transmission) params.set("transmission", transmission);
        if (priceRange[0] > filtersData.priceRange.min)
            params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < filtersData.priceRange.max)
            params.set("maxPrice", priceRange[1].toString());
        if (sortBy !== "newest") params.set("sortBy", sortBy);

        // Preserve search and page params if they exist
        const search = searchParams.get("search");
        const page = searchParams.get("page");
        if (search) params.set("search", search);
        if (page && page !== "1") params.set("page", page);

        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;

        router.push(url);
        setIsSheetOpen(false);
    }, [
        make,
        bodyType,
        fuelType,
        transmission,
        priceRange,
        sortBy,
        pathname,
        searchParams,
        filtersData.priceRange.min,
        filtersData.priceRange.max,
    ]);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        switch (filterName) {
            case "make":
                setMake(value);
                break;
            case "bodyType":
                setBodyType(value);
                break;
            case "fuelType":
                setFuelType(value);
                break;
            case "transmission":
                setTransmission(value);
                break;
            case "priceRange":
                setPriceRange(value);
                break;
        }
    };

    // Handle clearing specific filter
    const handleClearFilter = (filterName) => {
        handleFilterChange(filterName, "");
    };

    // Clear all filters
    const clearFilters = () => {
        setMake("");
        setBodyType("");
        setFuelType("");
        setTransmission("");
        setPriceRange([filtersData.priceRange.min, filtersData.priceRange.max]);
        setSortBy("newest");

        // Keep search term if exists
        const params = new URLSearchParams();
        const search = searchParams.get("search");
        if (search) params.set("search", search);

        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;

        router.push(url);
        setIsSheetOpen(false);
    };

    return <div className="flex lg:flex-col justify-between gap-4">{/* mobile filters */}
        <div className="lg:hidden mb-4">
            <div className="flex items-center">
                <div>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant=" outline" className="flex items-center gap-2 ">
                                <Filter className="h-4 w-4" /> Filters{" "}
                                {activeFilterCount > 0 && (
                                    <Badge className={"ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"}>
                                        {activeFilterCount}

                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left"
                            className="w-full sm:max-w-md overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>

                            </SheetHeader>
                            <div className="py-6">
                                <CarFilterControls
                                    filters={filtersData}
                                    currentFilters={currentFilters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilter={handleClearFilter}
                                />
                            </div>
                            <SheetFooter className="sm:justify-between flex-row pt-2 border-t space-x-4 mt-auto">
                                <Button type="button"
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="flex-1">
                                    Reset
                                </Button>
                                <Button type="button" onClick={applyFilters} className="flex-1">Show Results</Button>

                            </SheetFooter>

                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
        {/* sort selectio*/}
        <Select
            value={sortBy}
            onValueChange={(value) => {
                setSortBy(value);
                setTimeout(() => applyFilters(), 0);
            }}>

            <SelectTrigger className="w-[180px] lg:w-full">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {
                    [
                        { value: "newest", label: "Newest First" },
                        { value: "priceAsc", label: "Price: Low to High" },
                        { value: "priceDesc", label: "Price: High to Low" },
                    ].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}

            </SelectContent>
        </Select>
        {/* desktop filters*/}
        <div className="hidden lg:block sticky top-24">
            <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                        <Sliders className="h-4 w-4 mr-2" />
                        Filters
                    </h3>
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            className="h-8 text-sm text-gray-600"
                            onClick={clearFilters}
                        >
                            <X className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
 
                    )}
                </div>
                <div className="p-4">
                    <CarFilterControls
                        filters={filtersData}
                        currentFilters={currentFilters}
                        onFilterChange={handleFilterChange}
                        onClearFilter={handleClearFilter}
                    />
                </div>

                <div className="px-4 pb-4 border-t">
                    <Button
                        type="button"
                        onClick={applyFilters}
                        className="w-full"
                    >
                        Apply Filters
                    </Button>

                </div>

            </div>
        </div>

    </div>
};

export default CarFilters;