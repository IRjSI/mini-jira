import { Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className="flex items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3 overflow-x-auto whitespace-nowrap">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {item.href ? (
                        <Link to={item.href} className="hover:text-slate-900 transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <ChevronRightIcon size={12} className="mx-2 shrink-0" />
                    )}
                </div>
            ))}
        </nav>
    );
}

export default Breadcrumbs;
