import React from 'react'

type Props = {
    label: string
}

const SectionHeader: React.FC<Props> = ({label}) => {
    return (
        <h2 className="mb-2 font-semibold text-slate-800">
            {label}
        </h2>
    )
}

export default SectionHeader