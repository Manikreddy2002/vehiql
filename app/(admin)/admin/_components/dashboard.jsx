"use client"

import { Alert, AlertTitle } from '@/components/ui/alert';
import { TabsContent, TabsList } from '@/components/ui/tabs';
import { Tabs, TabsTrigger } from '@radix-ui/react-tabs';
import { Info } from 'lucide-react';
import React, { useState } from 'react';

const Dashboard = ({ initialData }) => {
    const [activeTab, setActiveTab] = useState("overview");

    if (!initialData || !initialData.success) {
        return <Alert variant="destructive">
            <Info className='h-4 w-4' />
            <AlertTitle>
                Error
            </AlertTitle>
            <AlertDescription>
                {initialData?.error || "Failed to fetch dashboard data."}
            </AlertDescription>
        </Alert>;
    }

    return (
        <div><Tabs defaultValue='overview'
            value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
                    Overview
                </TabsTrigger>
                <TabsTrigger value="test-drive" onClick={() => setActiveTab("test-drive")}>
                    Test Drive
                </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className={space-y-6}>
                
            </TabsContent>
            <TabsContent value="test-drive" className={space-y-6}>

            </TabsContent>
        </Tabs>
        </div>
    )
}

export default Dashboard