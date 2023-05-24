window.onload = dailyGraph();
// Statistics graph function
function dailyGraph()
{
    // Handle menu color
    if (calTtl == "day"){
            document.getElementById("dailyId").style.color = "black";
            document.getElementById("dailyId").style.fontWeight = "bold";
        }
    if (calTtl == "week"){
            document.getElementById("weeklyId").style.color = "black";
            document.getElementById("weeklyId").style.fontWeight = "bold";
        }
    if (calTtl == "month"){
            document.getElementById("monthlyId").style.color = "black";
            document.getElementById("monthlyId").style.fontWeight = "bold";
        }
    if (calTtl == "year"){
            document.getElementById("yearlyId").style.color = "black";
            document.getElementById("yearlyId").style.fontWeight = "bold";
        }
    // Graph creating
    const data = {
            // Values x
			labels: labels_data,
			// Values y
			datasets: [
			{
			  label: "ESD false",
			  data: data1,
			  backgroundColor: "rgba(207, 16, 45)",
			  order: 3,
			  stack: 'stack1'
			},
			{
			  label: "ESD true",
			  data: data2,
			  backgroundColor: 'rgb(0, 178, 169)',
			  order: 3,
			  stack: 'stack1'
			}
			]
			}
            // Graph configuration
			const config = {
			type: 'bar',
			data: data,
			options: {
			plugins: {
			  title: {
					display: true,
					text: `Last ${dgtTtl} ${calTtl}`
			  },
			  subtitle: {
					display: true,
					text: `Total: ${sum_total}, True: ${sum_esd_true}, False: ${sum_esd_false}`
				},
			  tooltip: {
				mode: 'index'
			  }
			},
			scales: {
			  x: {
				stacked: true
			  },
			  y: {
				stacked: true
			  }
			}
			},
			};
            // Graph declaration
			const reportOutput = new Chart(
			document.getElementById('chart_display'),
			config
			);
}