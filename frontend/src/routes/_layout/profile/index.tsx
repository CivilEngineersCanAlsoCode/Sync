import { createFileRoute } from '@tanstack/react-router'
import { Container, Heading } from '@radix-ui/themes'
import ResumeUpload from '@/components/Profile/ResumeUpload'

export const Route = createFileRoute('/_layout/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <Container size="3">
      <Heading size="8" className="mb-6">
        Profile
      </Heading>
      <div className="space-y-8">
        <section>
          <Heading size="6" className="mb-4">
            Resume
          </Heading>
          <ResumeUpload />
        </section>
      </div>
    </Container>
  )
}
// Is page par user apna resume upload kar sakta hai
