import { useState } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// Simple resume type until OpenAPI client regenerates  
interface Resume {
  id: string
  filename: string
  upload_date: string
}

export default function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  // Fetch existing resumes
  const { data: resumesData, isLoading } = useQuery({
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

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/v1/resumes/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail?.error || 'Upload failed')
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success('Resume upload ho gaya!')
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      setSelectedFile(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Sirf PDF files allowed hain')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File 10MB se kam honi chahiye')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (selectedFile) uploadMutation.mutate(selectedFile)
  }

  const latestResume = resumesData?.data?.[0]

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Upload Your Resume</h3>
          <p className="text-sm text-muted-foreground">Upload PDF resume for AI parsing</p>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="resume-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border px-4 py-2 hover:bg-accent transition-colors">
            <Upload className="w-4 h-4 mr-2" />Select PDF
          </label>
          <input id="resume-upload" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
          {selectedFile && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mr-2" />{selectedFile.name}
            </div>
          )}
          {selectedFile && (
            <Button onClick={handleUpload} disabled={uploadMutation.isPending} size="default">
              {uploadMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : 'Upload Resume'}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-card p-4 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : latestResume ? (
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-semibold mb-2">Current Resume</h4>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{latestResume.filename}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Uploaded: {new Date(latestResume.upload_date).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">No resume yet. Upload kar ke shuru karo!</p>
        </div>
      )}
    </div>
  )
}
