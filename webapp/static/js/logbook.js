window.onload = loadLogBook();
// loadLogBook function make logbook table into div bodyId
function loadLogBook()
{
    var menu_button = document.getElementById("logbookpage");
    menu_button.style = "font-weight: bold; color: #489d93; text-shadow: 1px 1px 1px black,2px 5px 2px #F1F1F1; font-size: 28px; padding: 10px 0px 0px;";
    // Existing element declaration
    var bookBody = document.getElementById('bodyId');
    var pagesArea = document.getElementById("pageNumbersAreaId");
    var numbersArea = document.getElementById("numbersAreaId");
    // Log book table creating
    var boxNames = []
    for (var i = 0; i <= rows - 1; i++)
    {
        var logBook = document.createElement('div');
        logBook.id = "logBookRow" + i;
	    logBook.style = "background: white; margin-left: 20%; display: flex;";
        for (var w = 0; w <= cols - 1; w++)
        {
            const arraySplit = dbArray[i].split(",");
            var box = document.createElement('div');
            box.innerText = arraySplit[w];
	        box.id = "box" + i + w;
	        box.style = "background: white; width: 25%; height: 50px; float: left; border: 1px solid; border-color: #cccccc; text-align: center; padding: 13px; box-sizing: border-box;";
            boxNames.push("box" + i + w);
            logBook.appendChild(box);
            bookBody.appendChild(logBook);
        }
    }
    // Page numbers for browsing
    for (var i = 1; i <= existingPages; i++)
    {
        var pageNumber = document.createElement('a');
        pageNumber.id = "pagenumber" + i
        pageNumber.innerText = i;
        pageNumber.style = "color: #666666; margin: 5px; font-size: 25px; font-family: Monaco, Monospace; float: none";
        let num = i;
        pageNumber.onclick = function(){changeSide(num)};
        numbersArea.appendChild(pageNumber);
    }
    var page1 = document.getElementById("pagenumber1");
    page1.style = "color: #489d93; margin: 5px; font-size: 32px; font-family: Monaco, Monospace; font-weight: bold; float: none";
    document.getElementById("previousArrow").style.display = "none";
}
// Browsing page function changeSide remove existing elements in logbook and make new elements with new data
function changeSide(pageNum)
{
    var bookBody = document.getElementById('bodyId');
    var start = (pageNum - 1)*rows;
    var last_page_rows = dbArray.length - (pageNum-1)*rows;
    var end, new_rows, add_rows_to_chosen_page;
    var newBoxes = []
    // Change chosen browsing number style
    for (var i = 1; i <= existingPages; i++)
    {
        document.getElementById("pagenumber" + i).style = "color: #666666; margin: 5px; font-size: 25px; font-family: Monaco, Monospace;";
    }
    document.getElementById("pagenumber" + pageNum).style = "color: #489d93; margin: 5px; font-size: 32px; font-family: Monaco, Monospace; font-weight: bold";
    // Make counting for end and new_rows.
    // end is used in loop for new data filling
    // new_rows is used for new logbook making
    if (last_page_rows > rows)
    {
        var cnt_rws = (dbArray.length / rows) - pageNum;
        end = (dbArray.length / rows - cnt_rws)*rows-1;
        new_rows = rows;
    }
    else
    {
        end = start + last_page_rows - 1;
        new_rows = last_page_rows;
    }
    // Make filling with new data
    for (var i = start; i <= end; i++)
    {
        newBoxes.push(dbArray[i])
    }
    // Remove rows in previous logbook page
    var remove_rows = rows_in_chosen_page[rows_in_chosen_page.length - 1];
    for (var i = 0; i <= remove_rows - 1; i++)
    {
        document.getElementById("logBookRow" + i).remove();
    }
    // Count how many rows adds in rows_in_chosen_page
    if (last_page_rows > rows)
    {
        add_rows_to_chosen_page = rows;
    }
    else
    {
        add_rows_to_chosen_page = last_page_rows;
    }
    rows_in_chosen_page.push(add_rows_to_chosen_page);
    // Create new logbook with new data
    for (var i = 0; i <= new_rows - 1; i++)
    {
        var logBook = document.createElement('div');
        logBook.id = "logBookRow" + i;
        logBook.style = "background: white; margin-left: 20%; display: flex;";
        for (var w = 0; w <= cols - 1; w++)
        {
            var box = document.createElement('div');
            var newBoxesSplit = newBoxes[i].split(",");
            box.innerText = newBoxesSplit[w];
            box.id = "box" + i + w;
            box.style = "background: white; width: 25%; height: 50px; float: left; border: 1px solid; border-color: #cccccc; text-align: center; padding: 13px; box-sizing: border-box;";
            boxNames.push("box" + i + w);
            logBook.appendChild(box);
            bookBody.appendChild(logBook);
        }
    }
    // Hide arrows when last/first page is chosen
    if (pageNum == 1)
    {
        document.getElementById("previousArrow").style.display = "none";
    }
    else
    {
        document.getElementById("previousArrow").style.display = "block";
    }
    if (pageNum == existingPages)
    {
        document.getElementById("nextArrow").style.display = "none";
    }
    else
    {
        document.getElementById("nextArrow").style.display = "block";
    }
}
// Next page browsing function
function nextArrow()
{
    document.getElementById("previousArrow").style.display = "block";
    var num;
    for (var i = 1; i <= existingPages; i++)
    {
        var page = document.getElementById("pagenumber" + i);
        if (page.style.fontSize == "32px")
        {
            num = Number(page.innerText);
        }
    }
    changeSide(num + 1)
}
// Previous page browsing function
function previousArrow()
{
    var num;
    for (var i = 1; i <= existingPages; i++)
    {
        var page = document.getElementById("pagenumber" + i);
        if (page.style.fontSize == "32px")
        {
            num = Number(page.innerText);
        }
    }
    changeSide(num - 1)
}


