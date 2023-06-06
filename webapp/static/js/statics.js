window.onload = dailyGraph();
// Statistics graph function
function dailyGraph()
{
    var menu_button = document.getElementById("statisticspage");
    menu_button.style = "font-weight: bold; color: #489d93; text-shadow: 1px 1px 1px black,2px 5px 2px #F1F1F1; font-size: 28px;  padding: 10px 0px 0px;"
    // Handle menu color
    var daily =  document.getElementById('dailyId');
    if (typeof(daily) != 'undefined' && daily != null)
    {
      if (calTtl == "day"){
            document.getElementById("dailyId").style.color = "black";
            document.getElementById("dailyId").style.fontWeight = "bold";
        }
    }
    var weekly =  document.getElementById('weeklyId');
    if (typeof(weekly) != 'undefined' && weekly != null)
    {
        if (calTtl == "week"){
                document.getElementById("weeklyId").style.color = "black";
                document.getElementById("weeklyId").style.fontWeight = "bold";
            }
    }
    var monthly =  document.getElementById('monthlyId');
    if (typeof(monthly) != 'undefined' && monthly != null)
    {
        if (calTtl == "month"){
                document.getElementById("monthlyId").style.color = "black";
                document.getElementById("monthlyId").style.fontWeight = "bold";
            }
    }
    var yearly =  document.getElementById('yearlyId');
    if (typeof(yearly) != 'undefined' && yearly != null)
    {
    if (calTtl == "year"){
            document.getElementById("yearlyId").style.color = "black";
            document.getElementById("yearlyId").style.fontWeight = "bold";
        }
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
// Printing function
function print()
{
    var my_canvas = document.getElementById('chart_display')
    let url = my_canvas.toDataURL();
    // New tab to isolate canvas for printing
    let win = window.open();
    // 'img' element will show url as image
    win.document.write("<img src='" + url + "' style='width:100%;'/>");
    // Print calls after write
    win.setTimeout(() => win.print(), 0);
    // Close window after print
    win.setTimeout(() => win.close(), 0);
}
