import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/ui/loading-button"
import { JobsService, JobCreate } from "@/client"

// Romanised Hindi validation messages
const formSchema = z.object({
  title: z.string().min(1, "Job title bharna zaroori hai").max(100, "Title bahut bada hai"),
  company: z.string().min(1, "Company name bharna zaroori hai").max(100, "Company name bahut bada hai"),
  url: z.string().url("Sahi URL format use karein").min(1, "URL bharna zaroori hai"),
  location: z.string().min(1, "Location bharna zaroori hai").max(255, "Location bahut badi hai"),
  description: z.string().min(1, "Job description bharna zaroori hai").max(5000, "Description bahut bada hai"),
})

type FormValues = z.infer<typeof formSchema>

export function AddJobModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable "Save Job" button based on real-time validity
    defaultValues: {
      title: "",
      company: "",
      url: "",
      location: "",
      description: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: JobCreate) => JobsService.createJob({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job successfully added!", {
        style: { backgroundColor: "#3B82F6", color: "#FFFFFF" }, // Success Blue
      })
      setOpen(false)
      form.reset()
    },
    onError: (err: any) => {
      const errorMessage = err.body?.detail?.error || "Server par error aaya, please firse koshish karein"
      toast.error(errorMessage)
    },
  })

  function onSubmit(values: FormValues) {
    mutation.mutate(values)
  }
  // Ye function form submit hone par backend API call trigger karta hai

  // Handle accidental dismissal if form is dirty (AC 9)
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && form.formState.isDirty) {
      if (window.confirm("Aapne changes save nahi kiye hain. Kya aap band karna chahte hain?")) {
        setOpen(false)
        form.reset()
      }
      return
    }
    setOpen(newOpen)
    if (newOpen) form.reset()
  }
  // Ye handler modal ke open/close state aur unsaved changes protection ko manage karta hai

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[12px] bg-white border-none shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#006666] font-bold text-xl tracking-tight">
            Add New Job
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-medium">Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} className="focus-visible:ring-[#006666]" />
                  </FormControl>
                  <FormMessage className="text-[#E87D63] text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-medium">Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Corp" {...field} className="focus-visible:ring-[#006666]" />
                  </FormControl>
                  <FormMessage className="text-[#E87D63] text-xs" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-medium">Job URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} className="focus-visible:ring-[#006666]" />
                    </FormControl>
                    <FormMessage className="text-[#E87D63] text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-medium">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Remote / Bengaluru" {...field} className="focus-visible:ring-[#006666]" />
                    </FormControl>
                    <FormMessage className="text-[#E87D63] text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-medium">Description (JD Text)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the job description here..." 
                      className="min-h-[120px] focus-visible:ring-[#006666]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[#E87D63] text-xs" />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <LoadingButton
                type="submit"
                className="w-full bg-[#006666] hover:bg-[#004d4d] text-white font-bold h-11 transition-all"
                loading={mutation.isPending}
                disabled={!form.formState.isValid || mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Job"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
// Is component se hum job details enter karne ke liye ek modal show karte hain
