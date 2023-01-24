import Link from "next/link";
import { FC, HTMLProps } from "react";
import { Lines } from "./Lines";

export const Layout: FC<
	{
		isHomepage?: boolean;
		children?: React.ReactNode;
	} & HTMLProps<HTMLDivElement>
> = ({ isHomepage = false, children, ...rest }) => (
	<div className="app" {...rest}>
		<header>
			<Link href="/" title="Back to home" className="header__back">
				{!isHomepage && (
					<svg>
						<use
							xmlnsXlink="http://www.w3.org/1999/xlink"
							xlinkHref="#icon-chevron-left"
						></use>
					</svg>
				)}
			</Link>
			<Link href="/" className="header__title">
				TubeAlert
			</Link>
			<Link href="/settings" title="Settings" className="header__settings">
				<svg>
					<use
						xmlnsXlink="http://www.w3.org/1999/xlink"
						xlinkHref="#icon-settings"
					></use>
				</svg>
			</Link>
		</header>
		<main className={isHomepage ? "main--home" : "main--subpage"}>
			{children}
		</main>
		<nav className={isHomepage ? "nav--home" : "nav--subpage"}>
			<Lines />
		</nav>
	</div>
);
