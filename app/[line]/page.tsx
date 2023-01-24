import { Layout } from "@/src/components/Layout";
import { notFound } from "next/navigation";
import { getLineFromUrlKey } from "../../src/services/lines";
import "../../src/styles/linePage.css";

export default ({ params: { line } }) => {
	const lineData = getLineFromUrlKey(line);
	if (!lineData) {
		notFound();
	}
	return (
		<Layout data-line={lineData.tflKey}>
			<div className="linePage__header">
				<h1>{lineData.name}</h1>
			</div>
			<div>OI</div>
		</Layout>
	);
};
