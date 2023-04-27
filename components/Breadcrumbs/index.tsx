import React from "react";

type Props = {
    items: any[],
    renderItem: (item: any) => React.ReactNode,
    wrapperClassName?: string,
}

const Breadcrumbs: React.FC<Props> = ({ items, renderItem, wrapperClassName = "" }) => {
    return (
        <nav className={`flex ${wrapperClassName}`} aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
                {items.map((item, index) => {
                    const shouldRenderSeparator = index > 0;
                    console.log(item, shouldRenderSeparator, index);
                    return (
                        <li key={index}>
                            <div className="flex items-center">
                                {shouldRenderSeparator && <svg className="flex-shrink-0 h-5 w-5 text-gray-400"
                                                               xmlns="http://www.w3.org/2000/svg"
                                                               viewBox="0 0 20 20" fill="currentColor"
                                                               aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd" />
                                </svg>}
                                <div
                                    className="first:ml-0 ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                    {renderItem(item)}
                                </div>
                            </div>
                        </li>
                    );
                })}

                {/*<li>*/}
                {/*    <div className="flex items-center">*/}
                {/*        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"*/}
                {/*             viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">*/}
                {/*            <path fill-rule="evenodd"*/}
                {/*                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"*/}
                {/*                  clip-rule="evenodd" />*/}
                {/*        </svg>*/}
                {/*        <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Projects</a>*/}
                {/*    </div>*/}
                {/*</li>*/}

                {/*<li>*/}
                {/*    <div className="flex items-center">*/}
                {/*        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"*/}
                {/*             viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">*/}
                {/*            <path fill-rule="evenodd"*/}
                {/*                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"*/}
                {/*                  clip-rule="evenodd" />*/}
                {/*        </svg>*/}
                {/*        <a href="#" className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-700"*/}
                {/*           aria-current="page">Project Nero</a>*/}
                {/*    </div>*/}
                {/*</li>*/}
            </ol>
        </nav>

    );
};

export default Breadcrumbs;