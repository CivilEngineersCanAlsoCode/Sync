import { StringListInput } from './StringListInput';

interface ExperienceCardProps {
  form: UseFormReturn<CareerProfileUpdate>;
  index: number;
  remove: (index: number) => void;
}

export function ExperienceCard({ form, index, remove }: ExperienceCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Experience {index + 1}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => remove(index)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                     <Input {...field} placeholder="Company Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name={`experience.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                     <Input {...field} placeholder="Job Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name={`experience.${index}.duration`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                 <Input {...field} placeholder="e.g., 2020 - Present" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`experience.${index}.responsibilities`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities</FormLabel>
              <FormControl>
                <StringListInput 
                    value={field.value || []} 
                    onChange={field.onChange} 
                    addButtonLabel="Add Responsibility" 
                    placeholder="Key achievement or responsibility..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
