import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { JobsService } from "@/client"
import { ProbingQuestionInput } from "@/components/ProbingQuestionInput"
import { ProbingQuestionPublic } from "@/client"

export const Route = createFileRoute("/_layout/jobs/$jobId")({
  component: JobDetails,
})

function JobDetails() {
  const { jobId } = Route.useParams()

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => JobsService.readJob({ id: jobId }),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="animate-spin text-xl">Loading...</span>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="p-4 text-red-500">
        Error loading job: {error?.message || "Job not found"}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <div className="text-muted-foreground text-lg">
          {job.company} • {job.location} • <span className="font-medium text-foreground">{job.status}</span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mt-4 mb-2">Job Description</h3>
            <p className="whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Helper Questions</h2>
        {job.probing_questions && job.probing_questions.length > 0 ? (
          <div className="space-y-6">
            <p className="text-muted-foreground mb-4">
              Answering these questions helps the AI tailor your resume more effectively.
              Your answers are saved automatically as you type.
            </p>
            {job.probing_questions.map((question: ProbingQuestionPublic) => (
              <ProbingQuestionInput key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic">
            No helper questions generated for this job yet.
          </div>
        )}
      </div>
    </div>
  )
}
