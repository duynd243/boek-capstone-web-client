import React from 'react'

type Props = {
    children: React.ReactNode,
}

const TableWrapper: React.FC<Props> = ({children}) => {
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-slate-200 shadow sm:rounded-lg">
                        <table className="bg-gray-50 min-w-full divide-y divide-gray-200">
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableWrapper