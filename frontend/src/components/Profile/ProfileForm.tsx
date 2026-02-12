import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ProfileService, CareerProfileUpdate, CareerProfile } from '@/client/services/ProfileService';
import { ProjectCard } from './ProjectCard';
import { ExperienceCard } from './ExperienceCard';
import { SkillTagInput } from './SkillTagInput';
import { StringListInput } from './StringListInput';

export function ProfileForm() {
  const { resumeId } = useParams({ from: '/resumes/$resumeId/profile' });
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', resumeId],
    queryFn: () => ProfileService.getProfile(resumeId),
  });

  const form = useForm<CareerProfileUpdate>({
    defaultValues: {
      projects: [],
      experience: [],
      skills: [],
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        projects: profile.projects,
        experience: profile.experience,
        skills: profile.skills,
      });
    }
  }, [profile, form]);

  const updateMutation = useMutation({
    mutationFn: (data: CareerProfileUpdate) => ProfileService.updateProfile(resumeId, data),
    onSuccess: (data) => {
      toast.success("Profile Updated Successfully", {
        description: "Your changes have been saved.",
      });
      queryClient.setQueryData(['profile', resumeId], data);
    },
    onError: (err) => {
      toast.error("Update Failed", {
        description: "Could not save your changes. Please try again.",
      });
      console.error(err);
    },
  });

  const onSubmit = (data: CareerProfileUpdate) => {
    updateMutation.mutate(data);
  };

  // Field Arrays for Projects and Experience
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "experience",
  });
  
  // For Skills, we manage the list manually using useFieldArray to be consistent,
  // OR since it's a list of objects (SkillCategory), we use useFieldArray.
  const { fields: skillFields, append: appendSkillCat, remove: removeSkillCat } = useFieldArray({
      control: form.control,
      name: "skills",
  });

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-destructive p-8">Error loading profile. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile Editor</h2>
          <p className="text-muted-foreground">
            Review and manually Edit your AI-extracted profile.
          </p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!updateMutation.isPending && <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects ({projectFields.length})</TabsTrigger>
              <TabsTrigger value="experience">Experience ({expFields.length})</TabsTrigger>
              <TabsTrigger value="skills">Skills ({skillFields.length})</TabsTrigger>
            </TabsList>

            {/* PROJECTS TAB */}
            <TabsContent value="projects" className="space-y-4 mt-4">
              {projectFields.map((field, index) => (
                <ProjectCard 
                    key={field.id} 
                    form={form} 
                    index={index} 
                    remove={removeProject} 
                />
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => appendProject({ title: "", description: "", technologies: [] })} 
                className="w-full"
              >
                  Add Project
              </Button>
            </TabsContent>

            {/* EXPERIENCE TAB */}
            <TabsContent value="experience" className="space-y-4 mt-4">
                {expFields.map((field, index) => (
                    <ExperienceCard 
                        key={field.id}
                        form={form}
                        index={index}
                        remove={removeExp}
                    />
                ))}
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => appendExp({ company: "", role: "", duration: "", responsibilities: [] })} 
                    className="w-full"
                >
                    Add Experience
                </Button>
            </TabsContent>

            {/* SKILLS TAB */}
            <TabsContent value="skills" className="space-y-4 mt-4">
               {skillFields.map((field, index) => (
                   <Card key={field.id} className="mb-4">
                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-base font-semibold">
                               Category: 
                               <input 
                                className="ml-2 bg-transparent border-b border-input focus:outline-none"
                                {...form.register(`skills.${index}.category`)}
                                placeholder="Category Name"
                               />
                           </CardTitle>
                           <Button variant="ghost" size="icon" onClick={() => removeSkillCat(index)}>
                               <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                       </CardHeader>
                       <CardContent>
                           <SkillTagInput
                                skills={form.watch(`skills.${index}.skills`) || []}
                                onChange={(newSkills) => form.setValue(`skills.${index}.skills`, newSkills)}
                                categoryName={form.watch(`skills.${index}.category`) || "Skills"}
                            />
                       </CardContent>
                   </Card>
               ))}
               <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => appendSkillCat({ category: "", skills: [] })} 
                    className="w-full"
                >
                    Add Skill Category
                </Button>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
