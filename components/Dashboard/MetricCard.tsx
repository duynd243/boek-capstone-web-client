import {
    BadgeDelta,
    Card,
    Flex,
    Metric,
    Text,
    Color,
} from "@tremor/react";
type Props = {
    title: string;
    quantityOfTitle: number;
    deltaType: "increase" | "decrease" | "unchanged";
    deltaSubTitle?: string;
    subTitle: string;
    showDeltaIcon?: boolean;
}

const colors:  { [key: string]: Color } = {
    increase: "emerald",
    decrease: "rose",
    unchanged: "orange"
}

const MetricCard = ({ title, quantityOfTitle, deltaType, deltaSubTitle, subTitle, showDeltaIcon = true }: Props) => {
    return (
        <Card>
            <Text className='capitalize'>{title}</Text>
            <Flex
                justifyContent="start"
                alignItems="baseline"
                className="truncate space-x-3"
            >
                <Metric>
                    {quantityOfTitle}
                </Metric>
                {/* <Text className="truncate">từ 11</Text> */}
            </Flex>
            <Flex justifyContent="start" className="space-x-2 mt-4">
                {showDeltaIcon ? <BadgeDelta deltaType={deltaType} /> : null}
                <Flex justifyContent="start" className="space-x-1 truncate">
                    <Text color={colors[deltaType]}>{deltaSubTitle}</Text>
                    <Text className="truncate">{subTitle}</Text>
                </Flex>
            </Flex>
        </Card>
    )
}

export default MetricCard