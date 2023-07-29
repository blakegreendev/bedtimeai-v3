"use client";

import { MessageSquare } from "lucide-react";

import { Heading } from "@/components/heading";

import { Empty } from "@/components/ui/empty";

const PreviousStoryPage = () => {
  return (
    <div>
      <Heading
        title="Old stories..."
        description="Look at some of your old stories."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <Empty label="No story yet..." />
      </div>
    </div>
  );
};

export default PreviousStoryPage;
