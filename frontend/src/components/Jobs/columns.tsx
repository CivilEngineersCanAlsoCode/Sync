
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { JobPublic } from "@/client"
import { Link } from "@tanstack/react-router"

// Romanised Hindi: Ye function date ko readable format mein convert karta hai
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const columns: ColumnDef<JobPublic>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("title")}</div>
    }
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Romanised Hindi: Status ke hisab se badge ka color decide karte hain
      const status = row.getValue("status") as string
      // Default to outline/secondary, can be enhanced with mapping
      return <Badge variant="secondary">{status || "Unknown"}</Badge>
    },
  },
  {
    accessorKey: "url",
    header: "Job Link",
    cell: ({ row }) => {
      const url = row.getValue("url") as string
      return url ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline max-w-[200px] truncate block"
        >
          {url}
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
    {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return <div>{formatDate(row.getValue("created_at"))}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const job = row.original
      const meta = table.options.meta as { onDelete: (id: string) => void } | undefined

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">

            <DropdownMenuItem asChild>
                <Link to={`/jobs/${job.id}` as any}>View job details</Link> 
            </DropdownMenuItem>
             <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => meta?.onDelete(job.id.toString())}
             >
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
