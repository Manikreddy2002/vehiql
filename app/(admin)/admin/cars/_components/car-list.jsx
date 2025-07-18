"use client";
import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation';


const CarsList = () => {

  const [search, setSearch] = React.useState('');

  const router = useRouter();
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Implement search functionality here
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <Button onClick={() => router.push('/admin/cars/create')

        }
          className="flex items-center"><Plus className="h-4 w-4 " />
          Add car
        </Button>
        <form onSubmit={handleSearchSubmit} className="flex  w-full sm:w-auto">
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
            <Input className='pl-9 w-full sm:w-60'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search cars...'
            />
          </div>
        </form>
      </div>
      {/*cars table*/}
    </div>
  )
};

export default CarsList;