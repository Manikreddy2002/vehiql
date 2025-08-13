"use client";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, DollarSign, Info, TrendingUp, Car } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Dashboard = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const cars = initialData?.data?.cars || { available: 0, sold: 0, total: 0 };
  const testDrives = initialData?.data?.testDrives || { pending: 0, confirmed: 0, completed: 0, total: 0 };

  if (!initialData || !initialData.success) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {initialData?.error || "Failed to fetch dashboard data."}
        </AlertDescription>
      </Alert>
    );
  }

  // Calculations (use cars.total instead of cars.totalCars)
  const availablePercent = cars.total ? ((cars.available / cars.total) * 100) : 0;
  const soldPercent = cars.total ? ((cars.sold / cars.total) * 100) : 0;
  const testDriveSuccessPercent = testDrives.total ? ((testDrives.completed / testDrives.total) * 100) : 0;
  
  // Animated progress values on mount/page visit
  const [availableAnim, setAvailableAnim] = useState(0);
  const [testDriveAnim, setTestDriveAnim] = useState(0);

  useEffect(() => {
    // reset to 0 then animate to target to trigger CSS transitions
    setAvailableAnim(0);
    setTestDriveAnim(0);
    const id = setTimeout(() => {
      setAvailableAnim(availablePercent);
      setTestDriveAnim(testDriveSuccessPercent);
    }, 50);
    return () => clearTimeout(id);
  }, [availablePercent, testDriveSuccessPercent]);
  const upcomingTestDrives = testDrives.pending + testDrives.confirmed;
  const inventoryUtilization = cars.total ? ((cars.available / cars.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test-drive">Test Drive</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/cars" className="block">
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cars.total}</div>
                  <p className="text-sm text-muted-foreground">
                    {cars.available} available, {cars.sold} sold
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/test-drives" className="block">
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Test Drives</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testDrives.total}</div>
                  <p className="text-sm text-muted-foreground">
                    {testDrives.pending} pending, {testDrives.confirmed} confirmed
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(initialData?.data?.testDrives?.conversionRate ?? 0)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  From test drives to sales
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cars Sold</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cars.sold}</div>
                <p className="text-sm text-muted-foreground">
                  {soldPercent.toFixed(1)}% of inventory
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dealership Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Dealership Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Car Inventory Progress */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Car Inventory</h3>
                    <div className="flex items-center">
                      <Progress value={availableAnim} className="w-full" durationMs={1200} />
                      <span className="ml-2 text-sm">{availableAnim.toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Available inventory capacity
                    </p>
                  </div>
                  {/* Test Drive Success Progress */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">
                      Test Drive Success
                    </h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${testDriveAnim}%`,
                            transition: `width 1200ms ease`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {testDriveAnim.toFixed(0)}
                        %
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Completed test drives
                    </p>
                  </div>
                </div>
                {/* Summary Numbers */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {cars.sold}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Cars Sold</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-amber-600">
                      {upcomingTestDrives}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Upcoming Test Drives
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-600">
                      {inventoryUtilization.toFixed(0)}%
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Inventory Utilization
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="test-drive" className="space-y-6">
          {/* Add test drive details here if needed */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;