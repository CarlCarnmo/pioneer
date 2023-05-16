window.onload = loadLogBook();

function loadLogBook()
{
    document.getElementById("previousArrow").style.display = "none"
    // Existing element declaration
    var bookBody = document.getElementById('bookBodyId');
    var pagesArea = document.getElementById("pageNumbersAreaId");
    var numbersArea = document.getElementById("numbersAreaId");
    // Log book table
    const boxNames = []
    for (var i = 0; i <= rows - 1; i++)
    {
        var logBook = document.createElement('div');
        logBook.id = "logBookRow" + i
	    logBook.style = "background: white; margin-left: 20%; display: flex;"
        for (var w = 0; w <= cols - 1; w++)
        {
            const arraySplit = dbArray[i].split(",")
            var box = document.createElement('div');
            box.innerText = arraySplit[w];
	        box.id = "box" + i + w;
	        box.style = "background: white; width: 25%; height: 50px; float: left; border: 1px solid; border-color: #cccccc; text-align: center; padding: 13px; box-sizing: border-box;";
            boxNames.push("box" + i + w)
            logBook.appendChild(box);
            bookBody.appendChild(logBook);
        }
    }
    for (var i = 1; i <= existingPages; i++)
    {
        var pageNumber = document.createElement('a');
        pageNumber.id = "pagenumber" + i
        pageNumber.innerText = i;
        pageNumber.style = "color: #666666; margin: 5px; font-size: 25px; font-family: Monaco, Monospace; float: none";
        let num = i
        pageNumber.onclick = function(){changeSide(num)};
        numbersArea.appendChild(pageNumber);
    }
    var page1 = document.getElementById("pagenumber1");
    page1.style = "color: #489d93; margin: 5px; font-size: 32px; font-family: Monaco, Monospace; font-weight: bold; float: none";


}
//Browsing page function
function changeSide(pageNum)
{
    var bookBody = document.getElementById('bookBodyId');
    var start = (pageNum - 1)*rows
    var left_rows = dbArray.length - (pageNum-1)*rows
    var end, new_rows, add_rows_to_choosen_page;
    var newBoxes = []

    for (var i = 1; i <= existingPages; i++)
    {
        document.getElementById("pagenumber" + i).style = "color: #666666; margin: 5px; font-size: 25px; font-family: Monaco, Monospace;";
    }
    document.getElementById("pagenumber" + pageNum).style = "color: #489d93; margin: 5px; font-size: 32px; font-family: Monaco, Monospace; font-weight: bold"
    if (left_rows > rows)
    {
        var cnt_rws = (dbArray.length / rows) - pageNum
        end = (dbArray.length / rows - cnt_rws)*rows-1
        new_rows = rows
    }
    else
    {
        end = start + left_rows - 1
        new_rows = left_rows
    }
    for (var i = start; i <= end; i++)
    {
        newBoxes.push(dbArray[i])
    }
    var remove_rows = rows_in_choosen_page[rows_in_choosen_page.length - 1]
    for (var i = 0; i <= remove_rows - 1; i++)
    {
        document.getElementById("logBookRow" + i).remove()
    }
    if (left_rows > rows)
    {
        add_rows_to_choosen_page = rows
    }
    else
    {
        add_rows_to_choosen_page = left_rows
    }
    rows_in_choosen_page.push(add_rows_to_choosen_page)
    for (var i = 0; i <= new_rows - 1; i++)
    {
        var logBook = document.createElement('div');
        logBook.id = "logBookRow" + i
        logBook.style = "background: white; margin-left: 20%; display: flex;"
        for (var w = 0; w <= cols - 1; w++)
        {
            var box = document.createElement('div');
            var newBoxesSplit = newBoxes[i].split(",")
            box.innerText = newBoxesSplit[w];
            box.id = "box" + i + w;
            box.style = "background: white; width: 25%; height: 50px; float: left; border: 1px solid; border-color: #cccccc; text-align: center; padding: 13px; box-sizing: border-box;";
            boxNames.push("box" + i + w)
            logBook.appendChild(box);
            bookBody.appendChild(logBook);
        }
    }
    if (pageNum === 1)
    {
        document.getElementById("previousArrow").style.display = "none"
    }
    else
    {
        document.getElementById("previousArrow").style.display = "block"
    }
    console.log(rows_in_choosen_page)
}
// Next page browsing function
function nextArrow()
{
    document.getElementById("previousArrow").style.display = "block"
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


