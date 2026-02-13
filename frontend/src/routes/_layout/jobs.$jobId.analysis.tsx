import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/jobs/$jobId/analysis")({
  component: JobAnalysis,
})

function JobAnalysis() {
  const { jobId } = Route.useParams()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Job Analysis Placeholder</h1>
      <p>Analyzing Job ID: {jobId}</p>
    </div>
  )
}
