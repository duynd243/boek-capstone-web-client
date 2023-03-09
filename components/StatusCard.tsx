
type Props = {
    variant?: "success" | "error" | "warning" | "info";
    customColor?: string;
    label: string;
};

const StatusCard = ({ variant = "success", customColor, label }: Props) => {
    let color = customColor
        ? customColor
        : variant === "success"
        ? "green"
        : variant === "error"
        ? "red"
        : variant === "warning"
        ? "yellow"
        : "blue";

    return (
        <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold uppercase leading-5 text-${color}-800 bg-${color}-100`}
        >
            {label}
        </span>
    );
};

export default StatusCard;