import * as cheerio from "cheerio";

export async function getStages(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const table = $(
    `#page-wrap > table:nth-child(7) > tbody > tr > td:nth-child(3) > table`
  );
  const stages = [];

  table.find("tr").each((i, elem) => {
    const div = $(elem).find("div");
    const stage = div.text();
    const href = div.find("a").attr("href");
    let stageId;
    if (href) {
      stageId = href.split("stageid=");
      if (stageId) stageId = stageId[1];
    }
    // const stageId = href.split("stageid=")[1];
    if (stage && stageId) {
      stages.push({ stage, href, stageId });
    }
  });
  stages.shift();
  return stages;
}

export async function getStageRankings(html) {
  const $ = cheerio.load(html, { decodeEntities: false });

  const table = $(
    `#page-wrap > table:nth-child(7) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td > table:nth-child(4)`
  );

  const rowsData = [];

  table.find("tr").each((i, elem) => {
    const rowData = {};

    $(elem)
      .find("td")
      .each((j, td) => {
        if (j === 1) {
          // Handling the <a> tag separately for the "Driver" column
          rowData["Driver"] = $(td).find("a").text().trim();
        } else {
          const columnText = $(td).text().trim();

          const columnHeader = getColumnHeader(j); // Get the column header dynamically
          if (columnHeader) {
            rowData[columnHeader] = columnText;
          }
        }
      });

    rowsData.push(rowData);
  });
  const filteredData = rowsData.filter((i) => i.Driver);
  console.log(filteredData);
  return filteredData;
}

// Function to get the column header dynamically based on the index
function getColumnHeader(index) {
  const headers = [
    "Driver",
    "Car",
    "Chkpoint 1 Time",
    "Chkpoint 2 Time",
    "Finish Time",
    "Diff. Prev",
    "Diff. First",
    "Uploaded",
  ];
  return headers[index - 1]; // Subtract 1 because index 0 corresponds to "Driver"
}
