import { notFound } from "next/navigation";
import { getLineFromUrlKey } from "../../src/services/lines";

export default ({ params: { line } }) => {
	const lineDatA = getLineFromUrlKey(line);
	if (!lineDatA) {
		notFound();
	}
	return <h1>{lineDatA.name}</h1>;
};
