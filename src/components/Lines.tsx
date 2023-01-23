import { FC } from "react";
import Link from "next/link";
import "./Lines.css";

import { ALL_LINES } from "../services/lines";

export const Lines: FC = () => {
	return (
		<ol className="lines">
			{ALL_LINES.map((line) => (
				<li key={line.tflKey} data-line={line.tflKey} className="lines__item">
					<Link href={`/${line.urlKey}`} className="lines__link">
						<span className="lines__text">
							{line.name}
							<br />
							Good Service
						</span>
						<svg className="lines__alert">
							<use
								xmlnsXlink="http://www.w3.org/1999/xlink"
								xlinkHref="#icon-alert"
							></use>
						</svg>
						<svg className="lines__cta">
							<use
								xmlnsXlink="http://www.w3.org/1999/xlink"
								xlinkHref="#icon-chevron-right"
							></use>
						</svg>
					</Link>
				</li>
			))}
		</ol>
	);
};
