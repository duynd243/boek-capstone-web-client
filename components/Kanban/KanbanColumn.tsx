import React from 'react'

type Props = {
    header?: React.ReactNode
    children: React.ReactNode
    columnWidth?: string
}

const KanbanColumn: React.FC<Props> = ({header, children, columnWidth = 'w-72'}) => {
    const ref = React.useRef<HTMLDivElement>(null);

    // React.useEffect(() => {
    //     ref.current?.addEventListener('scroll', (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         const scrollTop = ref.current?.scrollTop;
    //         const clientHeight = ref.current?.clientHeight;
    //         const scrollHeight = ref.current?.scrollHeight;
    //         console.log(scrollTop, clientHeight, scrollHeight)
    //         // check if scroll is at the bottom
    //         if(scrollTop && clientHeight && scrollHeight && scrollTop + clientHeight >= scrollHeight) {
    //             console.log('scroll at bottom')
    //         }
    //     });
    //
    //     return () => {
    //         ref.current?.removeEventListener('scroll', () => {});
    //     }
    // });
    return (
        <div className={`flex flex-col flex-shrink-0 ${columnWidth}`}>
            {header}
            <div ref={ref} className='flex flex-col pb-4 space-y-6 pt-3 mt-1 overflow-auto'>
                {children}
            </div>
        </div>
    )
}

export default KanbanColumn