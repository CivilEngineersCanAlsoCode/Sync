import { createFileRoute } from "@tanstack/react-router"
import { AddJobForm } from "../../components/Jobs/AddJobForm"

export const Route = createFileRoute("/_layout/jobs/add")({
  component: AddJobPage,
})

function AddJobPage() {
  return (
    <div className="container mx-auto py-10">
      <AddJobForm />
    </div>
  )
}
