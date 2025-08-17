"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { CreatePropertyFormWrapper } from "@/components/page-properties/property-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CreatePropertyPage() {
  const router = useRouter()
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null)

  const handleSave = () => {
    if (formRef) {
      formRef.requestSubmit()
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-lg font-semibold">Thêm bất động sản</h1>
            <div className="flex items-center gap-2 ml-auto">
              <Button type="button" size="sm" onClick={handleSave}>
                Lưu
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => router.back()}>
                Huỷ
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4">
          <CreatePropertyFormWrapper formRef={setFormRef} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
