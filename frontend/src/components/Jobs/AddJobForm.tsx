import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { JobsService } from "../../client"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

const formSchema = z.object({
  title: z.string().min(1, "Job title zaroori hai"),
  company: z.string().min(1, "Company name zaroori hai"),
  url: z.string().url("Valid URL enter karein").optional().or(z.literal("")),
  jd_text: z.string().min(1, "Job Description (JD) zaroori hai"),
})

export function AddJobForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      url: "",
      jd_text: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Send url as null if empty string
      const payload = {
        ...values,
        url: values.url || null,
      }
      return JobsService.createJob({ requestBody: payload })
    },
    onSuccess: () => {
      toast.success("Job successfully saved!")
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      // Navigate to jobs list
      navigate({ to: "/jobs" })
    },
    onError: (error: any) => {
      const errDetail = error.body?.detail || { error: "Job save nahi ho payi", code: "SAVE_ERROR" }
      toast.error(errDetail.error || "Kuch gadbad ho gayi")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-lg border shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Nayi Job Add Karein</h2>
          <p className="text-muted-foreground">Apni dream job ki details yahan bharein taaki hum resume tailor kar sakein.</p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Google" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://careers.google.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jd_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description (JD)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Poora JD text yahan paste karein..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Saving..." : "Save Job"}
        </Button>
      </form>
    </Form>
  )
}
// Is form se user nayi job ki details enter karta hai.
