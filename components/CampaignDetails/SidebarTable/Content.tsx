import React from "react";

type Props = {
    text: string;
}

const Content: React.FC<Props> = ({ text }) => {
    return (
        <div className="text-sm text-slate-500">
            {text}
        </div>
    );
};

export default Content;