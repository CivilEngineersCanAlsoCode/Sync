import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { SkillTagInput } from './SkillTagInput';
import { CareerProfileUpdate } from '@/client/services/ProfileService';

interface ProjectCardProps {
  form: UseFormReturn<CareerProfileUpdate>;
  index: number;
  remove: (index: number) => void;
}

export function ProjectCard({ form, index, remove }: ProjectCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Project {index + 1}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => remove(index)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormField
          control={form.control}
          name={`projects.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Project Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`projects.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe what you built..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`projects.${index}.technologies`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormControl>
                <SkillTagInput
                  skills={field.value || []}
                  onChange={field.onChange}
                  categoryName={`Project ${index + 1} Technologies`}
                  placeholder="Add technology..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name={`projects.${index}.impact`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Business impact..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
