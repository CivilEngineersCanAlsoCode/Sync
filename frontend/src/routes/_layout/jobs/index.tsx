
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { JobsService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import { columns } from "@/components/Jobs/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Romanised Hindi: Jobs list ko fetch karne ke liye query options define karte hain
const jobsQueryOptions = {
    queryKey: ['jobs'],
    queryFn: () => JobsService.readJobs({ limit: 100, skip: 0 }),
}

export const Route = createFileRoute("/_layout/jobs/")({
  component: JobsPage,
})

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

// ... existing imports

function JobsPage() {
  const { data } = useQuery(jobsQueryOptions)
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => JobsService.deleteJob({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job delete ho gayi") // Romanised Hindi
      setDeleteId(null)
    },
    onError: () => {
      toast.error("Job delete nahi ho payi") // Romanised Hindi
    },
  })

  const jobs = data?.data || []

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Jobs Dashboard</h1>
         <Button asChild>
            <Link to="/jobs/add">
                <Plus className="mr-2 h-4 w-4" /> Add Job
            </Link>
         </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={jobs} 
        meta={{
            onDelete: (id: string) => setDeleteId(id)
        }} 
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job from your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
