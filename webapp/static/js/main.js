window.onload = book();
function book()
{
    var menu_button = document.getElementById("homepage");
    menu_button.style = "font-weight: bold; color: #489d93; text-shadow: 1px 1px 1px black,2px 5px 2px #F1F1F1; font-size: 28px; padding: 10px 0px 0px;"
    // Get and declare logbook div element
    var logbook = document.getElementById('logbookId');
    logbook.style = 'display: grid; width: 100%; overflow: scroll; overflow-y: hidden; margin-top: 20px;';
    // Declare div element for every row in logbook
    var row = document.createElement('div');
    row.style = 'position: static; height: 35px; min-width: 1300px; width: 100%;';
    // Fill first row in logbook with month days
    for (var i = 0; i <= days; i++)
    {
        var box_calendar = document.createElement('div');
        box_calendar.id = 'box_calendar' + i;
        box_calendar.innerText = i;
        box_calendar.style = 'color: black; background: #f2f2f2; width: 28px; height: 25px; font-size: 20px; padding-top: 10px; padding-left: 10px; border: 1px solid; border-color: grey; float: left';
        row.appendChild(box_calendar);
    }
    logbook.appendChild(row);
    // Change first box innerText in first row with month name and change box size
    document.getElementById('box_calendar0').style = 'color: black; background: #f2f2f2; width: 60px; height: 35px; font-size: 24px; border: 1px solid; border-color: grey; float: left';
    document.getElementById('box_calendar0').innerText = month;
    // Logbook row for every rfid
    for (var i = 0; i <= rfid_array.length - 1; i++)
    {
        var row_data = document.createElement('div');
        row_data.style = 'position: static; height: 35px; min-width: 1300px; width: 100%;';
        // Row boxes equally days in month
        for (var a = 0; a <= days; a++)
        {
            var book_box = document.createElement('div');
            book_box.id = 'book_box' + i + "-" + a;
            book_box.innerText = "";
            book_box.style = 'color: black; background: white; width: 37px; height: 25px; font-size: 16px; padding-top: 10px; padding-left: 1px; border: 1px solid; border-color: grey; float: left';
            row_data.appendChild(book_box);
        }
        logbook.appendChild(row_data);
    }
    // Get all rfids in array and fill first column with rfids
    for (var i = 0; i <= rfid_array.length - 1; i++)
    {
        document.getElementById('book_box' + i + "-0").style = 'color: black; background: #f2f2f2; width: 60px; height: 35px; font-size: 24px; border: 1px solid; border-color: grey; float: left';
        document.getElementById('book_box' + i + "-0").innerText = rfid_array[i];
    }
    // Get data for every rfid and fill boxes with time and color of result
    for (var i = 0; i <= check_data.length - 1; i++)
    {
        for (var a = 0; a <= rfid_array.length - 1; a++)
        {
            if (check_data[i][0] == document.getElementById('book_box' + a + '-0').innerText)
            {
                var d = new Date(check_data[i][1]);
                var day = d.getUTCDate();
                var time = d.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit'}).replace(/AM|PM/,'');
                document.getElementById('book_box' + a + '-' + day).innerText = time;
                // Green box if esd test is true
                if (check_data[i][2] == 'True')
                {
                    document.getElementById('book_box' + a + '-' + day).style.background = '#70fab5'
                }
                // Red box if esd test is false
                if (check_data[i][2] == 'False')
                {
                    document.getElementById('book_box' + a + '-' + day).style.background = '#cf102d'
                }
            }
        }
    }
    // Add last 12 months in filter box
    var filter_month = document.getElementById('filter_monthID')
    for (i = 0; i <= months.length - 1; i++)
    {
        var test = document.createElement('option')
        test.innerText = months[i]
        test.value = months[i]
        filter_month.appendChild(test)
    }
    // Submit button for month filter
    var filter = document.getElementById('filter_monthFORM')
    var submit = document.createElement('button');
    submit.type = "submit"
    submit.innerText = "Select"
    filter.appendChild(submit)

    if (rfid_array.length < 1)
    {
        var nodata = document.createElement('h2')
        nodata.innerText = 'Data for this mounth is not found'
        logbook.appendChild(nodata)
    }
}

function printdiv(printpage) {
            // Make html page for printing
            var html_start = "<html><head>";
            var head_inner = document.head.innerHTML;
            var body_start = "</head><body>"
            var footstr = "</body></html>";
            // Get all elements in choosen div
            var newstr = document.all.item(printpage).innerHTML;
            // Save previous elements in body
            var oldstr = document.body.innerHTML;
            // Main js
            var js = '<script src="/static//js/lb2.js"></script>'
            // Background graphic on when page is printing. That help to get style and show colors in logbook
            var graphics_on = '<style type="text/css" media="print">* { -webkit-print-color-adjust: exact !important;'
                                'color-adjust: exact !important; }</style>'
            // Place variables in page
            document.body.innerHTML = html_start + head_inner + body_start + newstr + js + graphics_on + footstr;
            // Print page
            window.print();
            // Get back previous page
            document.body.innerHTML = oldstr;
            return false;
            }