import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"

export default function EditChecklist() {
		const [searchParams] = useSearchParams();
		let navigate = useNavigate();


	useEffect(() => {
		const checklistId = searchParams.get("checklistId");

		if (checklistId === null) {
			navigate("/checklists", { replace: true })
		}

	})

	return (
		<div>
			test
		</div>)
}
