"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
  userEmail: string
}

export function DashboardLayout({ children, userEmail }: DashboardLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "overview"

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const items = [{ name: "Home", href: "/" }]

    if (pathSegments.includes("blog-dashboard")) {
      items.push({ name: "Blog Dashboard", href: "/blog-dashboard" })
      if (currentTab && currentTab !== "overview") {
        items.push({
          name: currentTab.charAt(0).toUpperCase() + currentTab.slice(1).replace(/-/g, " "),
          href: `/blog-dashboard?tab=${currentTab}`,
        })
      }
    }
    // Add more conditions for other paths if needed
    return items
  }

  const breadcrumbItems = getBreadcrumbItems()

  return (
    <SidebarProvider defaultOpen={true}>
      {" "}
      {/* Sidebar starts open by default */}
      <DashboardSidebar userEmail={userEmail} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.name}>
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage>{item.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
