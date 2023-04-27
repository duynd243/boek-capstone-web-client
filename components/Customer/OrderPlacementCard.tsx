import React from "react";
import { FaStore, FaTruck } from "react-icons/fa";

const orderTypes = {
    "delivery": {
        icon: <FaTruck className="text-white bg-blue-600 rounded-full p-2 w-7 h-7 flex-shrink-0" />,
        label: "Giao hàng",
        description: "Đơn hàng sẽ được giao đến địa chỉ của bạn",
    },
    "pickup": {
        icon: <FaStore className="text-white bg-rose-600 rounded-full p-2 w-7 h-7 flex-shrink-0" />,
        label: "Tại quầy",
        description: "Bạn sẽ đến nhận đơn hàng tại quầy của chúng tôi",
    },
};

type Props = {
    orderType: "delivery" | "pickup";
    checked?: boolean;
}

const OrderPlacementCard: React.FC<Props> = ({ orderType, checked = false }) => {

    const {
        icon,
        description,
        label,
    } = orderTypes[orderType];
    return (
        <button
            type={"button"}
            className={`w-full h-full text-left py-4 px-6 rounded  shadow-sm duration-150 ease-in-out border-2 ${checked ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
            <div className="flex items-center">
                {/*<div*/}
                {/*    className={`w-4 h-4 flex-shrink-0 rounded-full mr-3 ${checked ? "border-4 border-blue-500" : "border-2 border-slate-300"}`}></div>*/}
                <div className="grow">
                    <div
                        className="flex gap-2 items-center mb-2">
                        {icon}
                        <span
                            className="font-semibold text-lg text-slate-700">{label}</span>

                        {/*<span><span className="font-medium text-emerald-600">$39.00</span>/mo</span>*/}
                    </div>
                    <div className="text-sm text-slate-600">
                        {description}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default OrderPlacementCard;