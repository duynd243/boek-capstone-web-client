// import React, { forwardRef, useState } from "react";
// import { twMerge } from "tailwind-merge";
//
// import {
//     Bar,
//     BarChart as ReChartsBarChart,
//     CartesianGrid,
//     Legend,
//     ResponsiveContainer,
//     Tooltip,
//     XAxis,
//     YAxis,
// } from "recharts";
// import { Color } from "@tremor/react";
// import { AxisDomain } from "recharts/types/util/types";
// export interface ChartTooltipProps {
//   active: boolean | undefined;
//   payload: any;
//   label: string;
//   categoryColors: Map<string, Color>;
//   valueFormatter: ValueFormatter;
// }
//
// export const ChartTooltipFrame = ({ children }: { children: React.ReactNode }) => (
//   <div
//     className={twMerge(
//       "bg-white",
//       "text-sm",
//       "rounded-md",
//       "border-sm",
//         "shadow-lg",
//     )}
//   >
//     {children}
//   </div>
// );
// const ChartTooltip = ({
//   active,
//   payload,
//   label,
//   categoryColors,
//   valueFormatter,
// }: ChartTooltipProps) => {
//   if (active && payload) {
//     return (
//       <ChartTooltipFrame>
//         <div
//           className={twMerge(
//             getColorClassNames(DEFAULT_COLOR, colorPalette.lightBorder).borderColor,
//             spacing.twoXl.paddingX,
//             spacing.sm.paddingY,
//             border.sm.bottom,
//           )}
//         >
//           <p
//             className={twMerge(
//               "text-elem",
//               getColorClassNames(DEFAULT_COLOR, colorPalette.darkText).textColor,
//               fontWeight.md,
//             )}
//           >
//             {label}
//           </p>
//         </div>
//
//         <div className={twMerge(spacing.twoXl.paddingX, spacing.sm.paddingY, "space-y-1")}>
//           {payload.map(({ value, name }: { value: number; name: string }, idx: number) => (
//             <ChartTooltipRow
//               key={`id-${idx}`}
//               value={valueFormatter(value)}
//               name={name}
//               color={categoryColors.get(name) ?? BaseColors.Blue}
//             />
//           ))}
//         </div>
//       </ChartTooltipFrame>
//     );
//   }
//   return null;
// };
//
// export type ValueFormatter = {
//   (value: number): string;
// };
//
// interface BaseChartProps extends React.HTMLAttributes<HTMLDivElement> {
//   data: any[];
//   categories: string[];
//   index: string;
//   colors?: Color[];
//   valueFormatter?: ValueFormatter;
//   startEndOnly?: boolean;
//   showXAxis?: boolean;
//   showYAxis?: boolean;
//   yAxisWidth?: number;
//   showAnimation?: boolean;
//   showTooltip?: boolean;
//   showGradient?: boolean;
//   showLegend?: boolean;
//   showGridLines?: boolean;
//   autoMinValue?: boolean;
//   minValue?: number;
//   maxValue?: number;
// }
//
// export interface BarChartProps extends BaseChartProps {
//     layout?: "vertical" | "horizontal";
//     stack?: boolean;
//     relative?: boolean;
// }
// export const BaseColors: { [key: string]: Color } = {
//   Slate: "slate",
//   Gray: "gray",
//   Zinc: "zinc",
//   Neutral: "neutral",
//   Stone: "stone",
//   Red: "red",
//   Orange: "orange",
//   Amber: "amber",
//   Yellow: "yellow",
//   Lime: "lime",
//   Green: "green",
//   Emerald: "emerald",
//   Teal: "teal",
//   Cyan: "cyan",
//   Sky: "sky",
//   Blue: "blue",
//   Indigo: "indigo",
//   Violet: "violet",
//   Purple: "purple",
//   Fuchsia: "fuchsia",
//   Pink: "pink",
//   Rose: "rose",
// };
// export const themeColorRange: Color[] = [
//   BaseColors.Cyan,
//   BaseColors.Sky,
//   BaseColors.Blue,
//   BaseColors.Indigo,
//   BaseColors.Violet,
//   BaseColors.Purple,
//   BaseColors.Fuchsia,
//   BaseColors.Slate,
//   BaseColors.Gray,
//   BaseColors.Zinc,
//   BaseColors.Neutral,
//   BaseColors.Stone,
//   BaseColors.Red,
//   BaseColors.Orange,
//   BaseColors.Amber,
//   BaseColors.Yellow,
//   BaseColors.Lime,
//   BaseColors.Green,
//   BaseColors.Emerald,
//   BaseColors.Teal,
//   BaseColors.Pink,
//   BaseColors.Rose,
// ];
//
// export const constructCategoryColors = (
//   categories: string[],
//   colors: Color[],
// ): Map<string, Color> => {
//   const categoryColors = new Map<string, Color>();
//   categories.forEach((category, idx) => {
//     categoryColors.set(category, colors[idx]);
//   });
//   return categoryColors;
// };
//
// export const defaultValueFormatter: ValueFormatter = (value: number) => value.toString();
//
// export const getYAxisDomain = (
//   autoMinValue: boolean,
//   minValue: number | undefined,
//   maxValue: number | undefined,
// ) => {
//   const minDomain = autoMinValue ? "auto" : minValue ?? 0;
//   const maxDomain = maxValue ?? "auto";
//   return [minDomain, maxDomain];
// };
//
// const CustomBarChart = React.forwardRef<HTMLDivElement, BarChartProps>((props, ref) => {
//     const {
//         data = [],
//         categories = [],
//         index,
//         colors = themeColorRange,
//         valueFormatter = defaultValueFormatter,
//         layout = "horizontal",
//         stack = false,
//         relative = false,
//         startEndOnly = false,
//         showAnimation = true,
//         showXAxis = true,
//         showYAxis = true,
//         yAxisWidth = 56,
//         showTooltip = true,
//         showLegend = true,
//         showGridLines = true,
//         autoMinValue = false,
//         minValue,
//         maxValue,
//         className,
//         ...other
//     } = props;
//     const [legendHeight, setLegendHeight] = useState(60);
//     const categoryColors = constructCategoryColors(categories, colors);
//
//     const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
//
//     return (
//         <div ref={ref} className={twMerge("w-full h-80", className)} {...other}>
//             <ResponsiveContainer width="100%" height="100%">
//                 <ReChartsBarChart
//                     data={data}
//                     stackOffset={relative ? "expand" : "none"}
//                     layout={layout === "vertical" ? "vertical" : "horizontal"}
//                 >
//                     {showGridLines ? (
//                         <CartesianGrid
//                             strokeDasharray="3 3"
//                             horizontal={layout !== "vertical"}
//                             vertical={layout === "vertical"}
//                         />
//                     ) : null}
//
//                     {layout !== "vertical" ? (
//                         <XAxis
//                             hide={!showXAxis}
//                             dataKey={index}
//                             interval="preserveStartEnd"
//                             tick={{ transform: "translate(0, 6)" }} //padding between labels and axis
//                             ticks={startEndOnly ? [data[0][index], data[data.length - 1][index]] : undefined}
//                             style={{
//                                 fontSize: "12px",
//                                 fontFamily: "Inter; Helvetica",
//                                 marginTop: "20px",
//                             }}
//                             tickLine={false}
//                             axisLine={false}
//                         />
//                     ) : (
//                         <XAxis
//                             hide={!showXAxis}
//                             type="number"
//                             tick={{ transform: "translate(-3, 0)" }}
//                             domain={yAxisDomain as AxisDomain}
//                             style={{
//                                 fontSize: "12px",
//                                 fontFamily: "Inter; Helvetica",
//                             }}
//                             tickLine={false}
//                             axisLine={false}
//                             tickFormatter={valueFormatter}
//                             padding={{ left: 10, right: 10 }}
//                             minTickGap={5}
//                         />
//                     )}
//                     {layout !== "vertical" ? (
//                         <YAxis
//                             width={yAxisWidth}
//                             hide={!showYAxis}
//                             axisLine={false}
//                             tickLine={false}
//                             type="number"
//                             domain={yAxisDomain as AxisDomain}
//                             tick={{ transform: "translate(-3, 0)" }}
//                             style={{
//                                 fontSize: "12px",
//                                 fontFamily: "Inter; Helvetica",
//                             }}
//                             tickFormatter={
//                                 relative ? (value: number) => `${(value * 100).toString()} %` : valueFormatter
//                             }
//                         />
//                     ) : (
//                         <YAxis
//                             width={yAxisWidth}
//                             hide={!showYAxis}
//                             dataKey={index}
//                             axisLine={false}
//                             tickLine={false}
//                             ticks={startEndOnly ? [data[0][index], data[data.length - 1][index]] : undefined}
//                             type="category"
//                             interval="preserveStartEnd"
//                             tick={{ transform: "translate(0, 6)" }}
//                             style={{
//                                 fontSize: "12px",
//                                 fontFamily: "Inter; Helvetica",
//                             }}
//                         />
//                     )}
//                     {showTooltip ? (
//                         <Tooltip
//                             // ongoing issue: https://github.com/recharts/recharts/issues/2920
//                             wrapperStyle={{ outline: "none" }}
//                             isAnimationActive={false}
//                             cursor={{ fill: "#d1d5db", opacity: "0.15" }}
//                             content={({ active, payload, label }) => (
//                                 <ChartTooltip
//                                     active={active}
//                                     payload={payload}
//                                     label={label}
//                                     valueFormatter={valueFormatter}
//                                     categoryColors={categoryColors}
//                                 />
//                             )}
//                             position={{ y: 0 }}
//                         />
//                     ) : null}
//                     {showLegend ? (
//                         <Legend
//                             verticalAlign="top"
//                             height={legendHeight}
//                             content={({ payload }) => ChartLegend({ payload }, categoryColors, setLegendHeight)}
//                         />
//                     ) : null}
//                     {categories.map((category) => (
//                         <Bar
//                             key={category}
//                             name={category}
//                             type="linear"
//                             stackId={stack || relative ? "a" : undefined}
//                             dataKey={category}
//                             fill={hexColors[categoryColors.get(category) ?? BaseColors.Gray]}
//                             isAnimationActive={showAnimation}
//                         />
//                     ))}
//                 </ReChartsBarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// });
//
// CustomBarChart.displayName = "CustomBarChart";
//
// export default CustomBarChart;