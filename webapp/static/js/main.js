window.onload = loadLogBook();

function loadLogBook()
{
    // Table colums and rows
    var cols = 3;
    var rows = 10;
    // Count existing pages
    var existingPages = dbArray.length / rows
    // Existing element declaration
    var bookBody = document.getElementById('bookBodyId');
    var pagesArea = document.getElementById("pageNumbersAreaId");
    var numbersArea = document.getElementById("numbersAreaId");
    // Log book table
    const boxNames = []
    for (var i = 0; i <= rows - 1; i++)
    {
        var logBook = document.createElement('div');
        logBook.id = "logbook" + rows - 1
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
    // Page numbers for browsing
    for (var i = 1; i <= existingPages; i++)
    {
        var pageNumber = document.createElement('a');
        pageNumber.id = "pagenumber" + i
        pageNumber.innerText = i;
        pageNumber.style = "color: #666666; margin: 5px; font-size: 25px; font-family: Monaco, Monospace; float: none";
        const num = i
        pageNumber.onclick = function(){changeSide(num)};
        numbersArea.appendChild(pageNumber);
    }
    var page1 = document.getElementById("pagenumber1");
    page1.style = "color: #489d93; margin: 5px; font-size: 32px; font-family: Monaco, Monospace; font-weight: bold; float: none";
    // Function for page browsing
    function changeSide(pageNum)
    {
        for (var i = 1; i <= existingPages; i++)
        {
            document.getElementById("pagenumber" + i).style = "color: #666666; margin: 5px; font-size: 25px; font-family: Monaco, Monospace;";
        }
        document.getElementById("pagenumber" + pageNum).style = "color: #489d93; margin: 5px; font-size: 32px; font-family: Monaco, Monospace; font-weight: bold"
        var start = (pageNum - 1)*rows
        var end = pageNum*rows-1
        const newBoxes = []
        for (var i = start; i <= end; i++)
        {
            for (var w = 0; w <= cols - 1; w++)
            {
                const arraySplitNew = dbArray[i].split(",")
                newBoxes.push(arraySplitNew[w])
            }
        }
        for (var i = 0; i <= cols*rows-1; i++)
        {
            document.getElementById(boxNames[i]).innerHTML = newBoxes[i]
        }
    }
}
