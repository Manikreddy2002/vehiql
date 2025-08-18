import { getDashboardData } from '@/actions/admin';
import Dashboard from "./_components/dashboard";
import React from 'react'

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for vehiql car marketplace.",

};

// (reverted) let Next decide rendering strategy


const AdminPage = async () => {
  const dashboardData = await getDashboardData();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <Dashboard initialData={dashboardData} />
    </div>
  )
};

export default AdminPage;