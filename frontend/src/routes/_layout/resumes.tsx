import { createFileRoute, Link } from "@tanstack/react-router"
import { Container, Heading, Text, Grid, Button } from "@radix-ui/themes"
import ResumeUpload from "@/components/Profile/ResumeUpload"
import { useQuery } from "@tanstack/react-query"
import { FileText, ArrowRight } from "lucide-react"

// Define Resume interface locally or import if available
interface Resume {
  id: string
  filename: string
  upload_date: string
  // Add other fields if necessary
}

export const Route = createFileRoute("/_layout/resumes")({
  component: Resumes,
})

function Resumes() {
  // Fetch resumes reusing the logic from ResumeUpload or a separate hook if available
  // Ideally ResumeUpload component handles the upload. 
  // We might want to list all resumes here if the user has multiple (though current req implies single owner).
  
  // For now, let's just render the ResumeUpload component which seems to have a "Current Resume" view.
  // And maybe a list if we want to show history.
  
  // Let's rely on ResumeUpload for now as it handles "Current Resume".
  // But we also need to link to the "Profile Editor" for the uploaded resume.
  
  const { data: resumesData } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const response = await fetch('/api/v1/resumes/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch')
      return await response.json() as { data: Resume[] }
    },
  })

  // We can show a list validation here too
  
  return (
    <Container size="3" p="4">
      <Heading mb="4">My Resumes</Heading>
      
      <ResumeUpload />

      {resumesData?.data?.map((resume) => (
        <div key={resume.id} className="mt-8 p-4 border rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
             <FileText className="w-5 h-5 text-blue-600" />
             <div>
                <Text weight="bold" as="div">{resume.filename}</Text>
                <Text size="1" color="gray">Uploaded: {new Date(resume.upload_date).toLocaleDateString()}</Text>
             </div>
          </div>
          
          <div className="flex gap-2">
            <Button asChild>
                <Link to="/resumes/$resumeId/profile" params={{ resumeId: resume.id }}>
                    Edit Profile <ArrowRight size={16} />
                </Link>
            </Button>
          </div>
        </div>
      ))}
    </Container>
  )
}
