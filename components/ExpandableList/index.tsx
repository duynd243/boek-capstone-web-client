import React, { Fragment, useState } from "react";

type Props = { items: any[], renderItem: (item: any) => React.ReactNode, maxItems?: number }
const ExpandableList: React.FC<Props> = ({
                                             items,
                                             renderItem,
                                             maxItems = 3,
                                         }) => {
    const [showAll, setShowAll] = useState(false);
    const itemsToShow = showAll ? items : items.slice(0, 3);
    return <Fragment>
        {itemsToShow.slice(0, maxItems).map((item) => renderItem(item))}
        {showAll && itemsToShow.slice(maxItems).map((item) => renderItem(item))}
        {items.length > maxItems && <button
            onClick={() => setShowAll(!showAll)}
            className="text-indigo-600 text-sm font-medium hover:underline">{showAll ? "Thu gọn" : "Xem thêm"}</button>}
    </Fragment>;
};

export default ExpandableList;