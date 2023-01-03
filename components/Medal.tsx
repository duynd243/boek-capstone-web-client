import React from "react";

interface IMedal {
  id: number;
  name: string;
  starColor: string;
  medalFill: string;
  medalStroke: string;
}

export class MedalTypes {
  static readonly DIAMOND: IMedal = {
    id: 1,
    name: "Kim cương",
    starColor: "fill-white",
    medalFill: "fill-blue-300",
    medalStroke: "fill-blue-400",
  };
  static readonly GOLD: IMedal = {
    id: 2,
    name: "Vàng",
    starColor: "fill-white",
    medalFill: "fill-yellow-400",
    medalStroke: "fill-yellow-500",
  };
  static readonly SILVER: IMedal = {
    id: 3,
    name: "Bạc",
    starColor: "fill-white",
    medalFill: "fill-gray-400",
    medalStroke: "fill-gray-500",
  };
  static readonly BRONZE: IMedal = {
    id: 4,
    name: "Đồng",
    starColor: "fill-white",
    medalFill: "fill-amber-500",
    medalStroke: "fill-amber-600",
  };
}

type Props = {
  size?: number;
  medalType: IMedal;
};

const Medal: React.FC<Props> = ({ size = 50, medalType }) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={size}
        height={size}
        viewBox="0 0 120 120"
        version="1.1"
        xmlSpace="preserve"
        fill="#000000"
      >
        <g strokeWidth={0} />
        <g>
          <g>
            <polygon
              className="fill-blue-500"
              points="75.7,107.4 60,97.5 44.3,107.4 44.3,41.1 75.7,41.1 "
            />
            <circle
              className={medalType.medalStroke}
              cx={60}
              cy="44.8"
              r="32.2"
            />
            <circle
              className={medalType.medalFill}
              cx={60}
              cy="44.8"
              r="25.3"
            />
            <path
              className={medalType.starColor}
              d="M61.2,29.7l4.2,8.4c0.2,0.4,0.6,0.7,1,0.8l9.3,1.4c1.1,0.2,1.6,1.5,0.8,2.3l-6.7,6.6c-0.3,0.3-0.5,0.8-0.4,1.2 l1.6,9.3c0.2,1.1-1,2-2,1.4l-8.3-4.4c-0.4-0.2-0.9-0.2-1.3,0L51,61.1c-1,0.5-2.2-0.3-2-1.4l1.6-9.3c0.1-0.4-0.1-0.9-0.4-1.2 l-6.7-6.6c-0.8-0.8-0.4-2.2,0.8-2.3l9.3-1.4c0.4-0.1,0.8-0.3,1-0.8l4.2-8.4C59.3,28.7,60.7,28.7,61.2,29.7z"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Medal;
