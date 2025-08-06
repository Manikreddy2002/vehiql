import { getSavedCars } from "@/actions/car-listing";
import { SavedCarsList } from "./_components/saved-cars-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved Cars | Vehiql",
  description: "View your saved cars and favorites",
};

export default async function SavedCarsPage() {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  // Fetch saved cars on the server
  const savedCarsResult = await getSavedCars();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6  mt-10 gradient font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text">Your Saved Cars</h1>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
}