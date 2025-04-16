"use client";
import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { BookmarkIcon, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MyJobsTabs() {
    const pathnname = usePathname();
    return (
        <div className="flex w-full flex-col">
            <Tabs
                aria-label="My Jobs Detail Menu"
                color="default"
                variant="underlined"
                classNames={{
                    tabList: "py-0",
                    tab: "py-6",
                }}
                selectedKey={pathnname}
            >
                <Tab
                    key={links.savedJobs}
                    href={links.savedJobs}
                    title={
                        <div className="flex items-center space-x-2">
                            <BookmarkIcon />
                            <span>Saved</span>
                        </div>
                    }
                />
                <Tab
                    key={links.appliedJobs}
                    href={links.appliedJobs}
                    title={
                        <div className="flex items-center space-x-2">
                            <UserIcon />
                            <span>Applied</span>
                        </div>
                    }
                />
            </Tabs>
        </div>
    );
}
