import React from 'react'

type Props = {}

const SkeletonItem: React.FC<Props> = ({}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
        </div>
    )
}

export default SkeletonItem