import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { JobsService } from "@/client"
import { Badge } from "@/components/ui/badge"
import { JobStatsGrid } from "@/components/Dashboard/JobStats"
import { AddJobModal } from "@/components/Dashboard/AddJobModal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - Resume Personalisation",
      },
    ],
  }),
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => JobsService.readJobs({}),
  })

  // Romanised Hindi: Status ke hisaab se badge ka color define karte hain
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-green-500 hover:bg-green-600"
      case "Shortlisted":
      case "Tailored":
        return "bg-blue-500 hover:bg-blue-600"
      case "Interviewing":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Offered":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600" // Draft / Rejected / Others
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold truncate max-w-sm">
            Hi, {currentUser?.full_name || currentUser?.email} 👋
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here are your tracked jobs.
          </p>
        </div>
        <AddJobModal>
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 cursor-pointer"
          >
            <span>＋</span> Add Job
          </button>
        </AddJobModal>
      </div>

      <JobStatsGrid />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Added On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading jobs...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-red-500">
                  Error loading jobs.
                </TableCell>
              </TableRow>
            ) : jobs?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No jobs found. Add a new job to get started!
                </TableCell>
              </TableRow>
            ) : (
              jobs?.data.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/jobs/$jobId"
                      params={{ jobId: job.id }}
                      className="hover:underline text-primary"
                    >
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {job.location || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Valid Link ↗
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(job.created_at || "").toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
