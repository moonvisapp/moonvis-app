import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbsForPath } from '../utils/seo';

export function Breadcrumbs() {
    const { pathname } = useLocation();
    const breadcrumbs = getBreadcrumbsForPath(pathname);

    if (breadcrumbs.length <= 1) return null;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                    <React.Fragment key={`${crumb.path}-${crumb.label}`}>
                        {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
                        {isLast ? (
                            <span aria-current="page">{crumb.label}</span>
                        ) : (
                            <Link to={crumb.path}>{crumb.label}</Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
