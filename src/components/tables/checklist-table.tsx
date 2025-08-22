import { Button } from "../ui/button"
import { Link2, Trash2, Pencil } from "lucide-react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table"
import { useChecklistTableData } from "../../hooks/useChecklistTableData"
export function ChecklistTable() {
	const { data, loading, error } = useChecklistTableData()
	return (
		<div className="max-w-[1200px] mx-auto">
			<Table className="w-full table-auto">
				<TableHeader>
					<TableRow>
						<TableHead className="px-2 py-1 w-[200px]">Equipment</TableHead>
						<TableHead className="px-2 py-1">Department</TableHead>
						<TableHead className="px-2 py-1">Frequency</TableHead>
						<TableHead className="px-2 py-1">Author</TableHead>
						<TableHead className="px-2 py-1">Created</TableHead>
						<TableHead className="px-2 py-1 text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading && (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								Loading...
							</TableCell>
						</TableRow>
					)}
					{error && (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4 text-red-500">
								{error}
							</TableCell>
						</TableRow>
					)}
					{!loading && !error && data.map((item, index) => (
						<TableRow
							key={index}
							onClick={() => console.log("Row clicked", item)}
							className="cursor-pointer hover:bg-muted"
						>
							<TableCell className="px-2 py-1 font-medium">
								{item.equipmentName} {item.equipmentModel}
							</TableCell>
							<TableCell className="px-2 py-1">{item.departmentName}</TableCell>
							<TableCell className="px-2 py-1">{item.frequency}</TableCell>
							<TableCell className="px-2 py-1">{item.authorName}</TableCell>
							<TableCell className="px-2 py-1">
								{new Date(item.createdDate).toLocaleDateString()}
							</TableCell>
							<TableCell className="px-2 py-1 text-right space-x-2">
								<Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
									<Link2 className="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
									<Pencil className="h-4 w-4 text-blue-500" />
								</Button>
								<Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
									<Trash2 className="h-4 w-4 text-red-500" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

// Equipment name
// Department name
// Frequency
// Author
// Created Date
// Link to questions
