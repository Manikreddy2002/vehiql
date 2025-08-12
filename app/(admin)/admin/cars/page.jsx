import CarsList from "./_components/car-list";
import { Suspense } from "react";

export const metadata = {
  title: "Cars | Vehiql Admin",
  description: "Manage cars in your marketplace",
};

export default function CarsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <Suspense>
        <CarsList />
      </Suspense>
    </div>
  );
}