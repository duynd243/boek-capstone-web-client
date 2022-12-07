import React from 'react'

type Props = {
    children: React.ReactNode;
}

const ErrorMessage: React.FC<Props> = ({children}) => {
    return (
        <div className="mt-1.5 text-sm font-medium text-rose-500 bg-rose-50 py-2 px-3 rounded">
            {children}
        </div>
    )
}

export default ErrorMessage