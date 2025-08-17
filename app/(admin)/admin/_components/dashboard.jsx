"use client";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, DollarSign, Info, TrendingUp, Car, Timer, Watch, Clock, ArrowRightIcon, CircleCheck, CircleCheckBig, CircleCheckBigIcon, CircleDivideIcon, CircleStop, CircleX } from "lucide-react";
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
  const pendingPercent = testDrives.total
    ? (testDrives.pending / testDrives.total) * 100
    : 0;
  const confirmedPercent = testDrives.total
    ? (testDrives.confirmed / testDrives.total) * 100
    : 0;
  const completedPercent = testDrives.total
    ? (testDrives.completed / testDrives.total) * 100
    : 0;
  const cancelledPercent = testDrives.total
    ? (testDrives.cancelled / testDrives.total) * 100
    : 0;
  const noShowPercent = testDrives.total
    ? (testDrives.noShow / testDrives.total) * 100
    : 0;

  // ✅ Add this
  const testDriveSuccessPercent = testDrives.total
    ? (testDrives.completed / testDrives.total) * 100
    : 0;



  // Animated progress values on mount/page visit
  const [availableAnim, setAvailableAnim] = useState(0);
  const [testDriveAnim, setTestDriveAnim] = useState(0);

  const [pendingAnim, setPendingAnim] = useState(0);
  const [confirmedAnim, setConfirmedAnim] = useState(0);
  const [completedAnim, setCompletedAnim] = useState(0);
  const [cancelledAnim, setCancelledAnim] = useState(0);
  const [noShowAnim, setNoShowAnim] = useState(0);





  // Trigger animations on mount

  useEffect(() => {
    // reset to 0 then animate to target to trigger CSS transitions
    setAvailableAnim(0);
    setTestDriveAnim(0);
    setPendingAnim(0);
    setConfirmedAnim(0);
    setCompletedAnim(0);
    setCancelledAnim(0);
    setNoShowAnim(0);
    const id = setTimeout(() => {
      setAvailableAnim(availablePercent);
      setTestDriveAnim(testDriveSuccessPercent);
      setPendingAnim(pendingPercent);
      setConfirmedAnim(confirmedPercent);
      setCompletedAnim(completedPercent);
      setCancelledAnim(cancelledPercent);
      setNoShowAnim(noShowPercent);
    }, 50);
    return () => clearTimeout(id);
  }, [availablePercent, testDriveSuccessPercent, pendingPercent,
    confirmedPercent,
    completedPercent,
    cancelledPercent,
    noShowPercent,
  ]);
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.total}</div>
                <p className="text-sm text-muted-foreground">


                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendings</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" style={{ color: 'orange' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.pending}</div>
                <p className="text-sm text-muted-foreground">
                  {(testDrives.pending / testDrives.total * 100).toFixed(1)}% of Bookings

                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <CircleCheckBigIcon className="h-4 w-4 text-muted-foreground" style={{ color: "green" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.confirmed}</div>
                <p className="text-sm text-muted-foreground">
                  {(testDrives.confirmed / testDrives.total * 100).toFixed(1)}% of Bookings

                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CircleCheckBigIcon className="h-4 w-4 text-muted-foreground" style={{ color: 'blue' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.completed}</div>
                <p className="text-sm text-muted-foreground">
                  {(testDrives.completed / testDrives.total * 100).toFixed(1)}% of Bookings

                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <CircleX className="h-4 w-4 text-muted-foreground" style={{ color: 'red' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.cancelled}</div>
                <p className="text-sm text-muted-foreground">
                  {(testDrives.cancelled / testDrives.total * 100).toFixed(1)}% of Bookings

                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Drive Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
                    <div className="text-3xl font-bold text-blue-600">
                      {testDrives.conversionRate}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Test drives resulting in car purchases
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
                    <div className="text-3xl font-bold text-green-600">
                      {(testDrives.completed / testDrives.total * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Test drives succesfully completed
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Booking Status BreakDown</h3>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <div className="flex items-center gap-2">
                      <div className="  relative-flex  overflow-hidden  w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${pendingAnim}%`,
                            backgroundColor: "orange",
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{pendingAnim.toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Confirmed */}
                  <div>
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <div className="flex items-center gap-2">
                    <div className="  relative-flex  overflow-hidden  w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${confirmedAnim}%`,
                          backgroundColor: "green",
                        }}
                      ></div>
                    </div>
                    <span>{confirmedAnim.toFixed(0)}%</span>
                  </div>
                  </div>
                  {/* Completed */}
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <div className="flex items-center gap-2">
                    <div className="  relative-flex  overflow-hidden  w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${completedAnim}%`,
                          backgroundColor: "blue",
                        }}
                      ></div>
                    </div>
                    <span>{completedAnim.toFixed(0)}%</span>
                    </div>
                  </div>
                  {/* Cancelled */}
                  <div>
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <div className="flex items-center gap-2">
                    <div className="  relative-flex  overflow-hidden  w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${cancelledAnim}%`,
                          backgroundColor: "red",
                        }}
                      ></div>
                    </div>
                    <span>{cancelledAnim.toFixed(0)}%</span>
                    </div>
                  </div>
                  {/* No Show */}
                  <div>
                    <p className="text-sm text-gray-600">No Show</p>
                    <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden  relative-flex">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${noShowAnim}%`,
                          backgroundColor: "purple",
                        }}
                      ></div>
                    </div>
                    <span>{noShowAnim.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>



        </TabsContent>
      </Tabs>
    </div>
  );
};


export default Dashboard;