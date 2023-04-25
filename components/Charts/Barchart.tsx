// import React from "react";
// // import { tailwindConfig, hexToRGB } from "../../utils/tailwind";
// import { rgba } from 'polished';
// import { useRef, useEffect } from 'react';

// import {
//   Chart, BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend,
// } from 'chart.js';
// import 'chartjs-adapter-moment';
// import { getFormattedPrice } from "../../utils/helper";
// Chart.register(BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend);



// type Props = {
 
// }

// const Barchart: React.FC<Props> = ({}) => {
//     const canvas = useRef(null);
//   const legend = useRef(null);

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const chart = new Chart(ctx, {
//       type: 'bar',
//       data: data,
//       options: {
//         layout: {
//           padding: {
//             top: 12,
//             bottom: 16,
//             left: 20,
//             right: 20,
//           },
//         },
//         scales: {
//           y: {
//             grid: {
//               drawBorder: false,
//             },
//             ticks: {
//               maxTicksLimit: 5,
//               callback: (value) => getFormattedPrice(value),
//             },
//           },
//           x: {
//             type: 'time',
//             time: {
//               parser: 'MM-DD-YYYY',
//               unit: 'month',
//               displayFormats: {
//                 month: 'MMM YY',
//               },
//             },
//             grid: {
//               display: false,
//               drawBorder: false,
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//           tooltip: {
//             callbacks: {
//               title: () => false, // Disable tooltip title
//               label: (context) => getFormattedPrice(context.parsed.y),
//             },
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         animation: {
//           duration: 500,
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//       plugins: [{
//         id: 'htmlLegend',
//         afterUpdate(c, args, options) {
//           const ul = legend.current;
//           if (!ul) return;
//           // Remove old legend items
//           while (ul.firstChild) {
//             ul.firstChild.remove();
//           }
//           // Reuse the built-in legendItems generator
//           const items = c.options.plugins.legend.labels.generateLabels(c);
//           items.forEach((item) => {
//             const li = document.createElement('li');
//             li.style.marginRight = tailwindConfig().theme.margin[4];
//             // Button element
//             const button = document.createElement('button');
//             button.style.display = 'inline-flex';
//             button.style.alignItems = 'center';
//             button.style.opacity = item.hidden ? '.3' : '';
//             button.onclick = () => {
//               c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
//               c.update();
//             };
//             // Color box
//             const box = document.createElement('span');
//             box.style.display = 'block';
//             box.style.width = tailwindConfig().theme.width[3];
//             box.style.height = tailwindConfig().theme.height[3];
//             box.style.borderRadius = tailwindConfig().theme.borderRadius.full;
//             box.style.marginRight = tailwindConfig().theme.margin[2];
//             box.style.borderWidth = '3px';
//             box.style.borderColor = item.fillStyle;
//             box.style.pointerEvents = 'none';
//             // Label
//             const labelContainer = document.createElement('span');
//             labelContainer.style.display = 'flex';
//             labelContainer.style.alignItems = 'center';
//             const value = document.createElement('span');
//             value.style.color = 
//             value.style.fontSize = 
//             value.style.lineHeight = 
//             value.style.fontWeight = 
//             value.style.marginRight = 
//             value.style.pointerEvents = 'none';
//             const label = document.createElement('span');
//             label.style.color = 
//             label.style.fontSize = 
//             label.style.lineHeight = 
//             const theValue = c.data.datasets[item.datasetIndex].data.reduce((a, b) => a + b, 0);
//             const valueText = document.createTextNode(getFormattedPrice(theValue));
//             const labelText = document.createTextNode(item.text);
//             value.appendChild(valueText);
//             label.appendChild(labelText);
//             li.appendChild(button);
//             button.appendChild(box);
//             button.appendChild(labelContainer);
//             labelContainer.appendChild(value);
//             labelContainer.appendChild(label);
//             ul.appendChild(li);
//           });
//         },
//       }],
//     });
//     return () => chart.destroy();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//     return (
//         <React.Fragment>
//       <div className="px-5 py-3">
//         <ul ref={legend} className="flex flex-wrap"></ul>
//       </div>
//       <div className="grow">
//         <canvas ref={canvas} width={width} height={height}></canvas>
//       </div>
//     </React.Fragment>
//     );
// };

// export default Barchart;