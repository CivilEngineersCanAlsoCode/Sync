import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from '@/components/Profile/ProfileForm'

export const Route = createFileRoute('/_layout/resumes/$resumeId/profile')({
  component: ProfileForm,
})
