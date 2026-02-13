
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobsService } from "@/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Type definition for JobStats based on backend model
type JobStats = {
  Draft: number
  Applied: number
  Shortlisted: number
  Interviewing: number
  Offered: number
  Redirected: number
  Waiting: number
}

// Display config for each status
const STATUS_CONFIG: Record<keyof JobStats, { label: string; color: string }> = {
  Draft: { label: "Draft", color: "text-muted-foreground" },
  Applied: { label: "Applied", color: "text-primary" },
  Shortlisted: { label: "Shortlisted", color: "text-primary" },
  Interviewing: { label: "Interviewing", color: "text-primary" },
  Waiting: { label: "Waiting for result", color: "text-muted-foreground" }, // AC1 compliance
  Offered: { label: "Offered", color: "text-blue-600 dark:text-blue-400 font-bold" },
  Redirected: { label: "Redirected", color: "text-muted-foreground" }, // AC1: Must use "Redirected"
}

// AC6: High count scaling logic
function formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'm';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
}

function JobStatsCard({ title, count, color, isLoading }: { title: string; count: number; color: string; isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className={`text-2xl font-bold truncate ${color}`} title={count.toString()}>
            {formatCount(count)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function JobStatsGrid() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jobStats"],
    queryFn: () => JobsService.readJobStats(),
  })

  if (isError) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm font-medium">Stats load nahi ho paye</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RotateCcw className="h-3 w-3" />
          Retry
        </Button>
      </div>
    )
  }

  // Define the order of cards
  const orderedStatuses: (keyof JobStats)[] = [
    "Draft",
    "Applied", 
    "Shortlisted",
    "Interviewing",
    "Waiting",
    "Offered",
    "Redirected"
  ]

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Job Pipeline</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderedStatuses.map((status) => (
          <JobStatsCard
            key={status}
            title={STATUS_CONFIG[status].label}
            count={data ? (data as any)[status] ?? 0 : 0}
            color={STATUS_CONFIG[status].color}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}
