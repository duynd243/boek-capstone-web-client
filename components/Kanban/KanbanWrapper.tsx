import React from 'react'

type Props = {
    children: React.ReactNode
    gap?: string
}

const KanbanWrapper: React.FC<Props> = ({children, gap = 'gap-6'}) => {
    return (
        <div className="flex flex-col max-w-full h-[80vh] overflow-auto text-gray-700">
            <div className={`flex flex-grow px-10 mt-4 ${gap} overflow-auto`}>
                {children}
            </div>
        </div>
    )
}

export default KanbanWrapper