import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { ProbingQuestionPublic,  ProbingQuestionsService, ApiError } from "../client"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "sonner"

interface ProbingQuestionInputProps {
  question: ProbingQuestionPublic
}

export function ProbingQuestionInput({ question }: ProbingQuestionInputProps) {
  const [value, setValue] = useState(question.answer || "")
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const queryClient = useQueryClient()

  // Sync state with prop if it changes externally (though mainly for initial load)
  useEffect(() => {
    setValue(question.answer || "")
  }, [question.answer])

  const mutation = useMutation({
    mutationFn: (newValue: string) => {
      return ProbingQuestionsService.updateProbingQuestion({
        id: question.id,
        requestBody: { answer: newValue },
      })
    },
    onMutate: () => {
      setStatus("saving")
    },
    onSuccess: (data) => {
      setStatus("saved")
      // Update cache optimistically or invalidate
      queryClient.setQueryData(["jobs", question.job_id], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          probing_questions: oldData.probing_questions.map((q: ProbingQuestionPublic) =>
            q.id === question.id ? { ...q, answer: data.answer } : q
          ),
        }
      })
      setTimeout(() => setStatus("idle"), 2000) 
    },
    onError: (err: ApiError) => {
      setStatus("error")
      toast.error("Failed to save answer", { description: err.message })
    },
  })

  const handleBlur = () => {
    if (value !== (question.answer || "")) {
      mutation.mutate(value)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={question.id}>{question.question_text}</Label>
        <span className="text-xs text-muted-foreground">
          {status === "saving" && "Saving..."}
          {status === "saved" && "Saved"}
          {status === "error" && <span className="text-red-500">Failed to save</span>}
        </span>
      </div>
      <Input
        id={question.id}
        value={value}
        onChange={(e) => {
           setValue(e.target.value)
           if (status !== 'idle' && status !== 'saving') setStatus('idle')
        }}
        onBlur={handleBlur}
        placeholder="Type your answer here..."
        className={status === "error" ? "border-red-500" : ""}
      />
    </div>
  )
}
