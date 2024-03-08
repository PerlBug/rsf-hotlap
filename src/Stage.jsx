import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPageHtml } from "./util";
import { getStageRankings } from "./parsers";
import { carsByGroup, allCars } from "./cars";

const tableCellStyle = {
  padding: "10px",
  border: "1px solid black",
};

export default function Stage() {
  const { stageId, stageName } = useParams();
  const [rankings, setRankings] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedCar, setSelectedCar] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof stageId !== "string") return;

    async function fetchData() {
      try {
        setLoading(true);
        const html = await getPageHtml(
          `https://rallysimfans.hu/rbr/rally_hotlap.php?centerbox=rsfhotlap&stageid=${stageId}`
        );
        const ranks = await getStageRankings(html);
        setRankings(ranks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [stageId]);

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setSelectedCar("All");
  };

  const handleCarChange = (e) => {
    setSelectedCar(e.target.value);
  };

  const filteredRankings = rankings.filter((ranking) => {
    if (selectedGroup !== "All") {
      if (!carsByGroup[selectedGroup].includes(ranking.Car)) {
        return false;
      }
    }
    if (selectedCar !== "All") {
      if (ranking.Car !== selectedCar) {
        return false;
      }
    }
    return true;
  });

  return (
    <div>
      <h3>{stageName} - Rankings</h3>

      <label htmlFor="groupSelect">Filter by Group: </label>
      <select
        id="groupSelect"
        value={selectedGroup}
        onChange={handleGroupChange}
      >
        <option value="All">All</option>
        {Object.keys(carsByGroup).map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="carSelect">Filter by Car: </label>
      <select id="carSelect" value={selectedCar} onChange={handleCarChange}>
        <option value="All">All</option>
        {allCars.map((car) => (
          <option key={car} value={car}>
            {car}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th style={tableCellStyle}>Position</th>
              <th style={tableCellStyle}>Driver</th>
              <th style={tableCellStyle}>Car</th>
              <th style={tableCellStyle}>Chkpoint 1 Time</th>
              <th style={tableCellStyle}>Chkpoint 2 Time</th>
              <th style={tableCellStyle}>Finish Time</th>
              <th style={tableCellStyle}>Diff. Prev</th>
              <th style={tableCellStyle}>Diff. First</th>
              <th style={tableCellStyle}>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {filteredRankings.map((ranking, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{ranking.Driver}</td>
                <td style={tableCellStyle}>{ranking.Car}</td>
                <td style={tableCellStyle}>{ranking["Chkpoint 1 Time"]}</td>
                <td style={tableCellStyle}>{ranking["Chkpoint 2 Time"]}</td>
                <td style={tableCellStyle}>
                  <b>{ranking["Finish Time"]}</b>
                </td>
                <td style={tableCellStyle}>{ranking["Diff. Prev"]}</td>
                <td style={tableCellStyle}>{ranking["Diff. First"]}</td>
                <td style={tableCellStyle}>{ranking.Uploaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
