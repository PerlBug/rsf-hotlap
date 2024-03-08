import { useEffect, useState } from "react";
import "./App.css";
import { getStages } from "./parsers";
import { Link } from "react-router-dom";
import { getPageHtml } from "./util";

function Stages() {
  const [stages, setStages] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    async function fetchData() {
      const html = await getPageHtml(
        "https://rallysimfans.hu/rbr/rally_hotlap.php"
      );
      const stages = await getStages(html);
      setStages(stages);
    }

    fetchData();
  }, []);
  return (
    <>
      <h1>RBR Hotlap Stages</h1>
      <label htmlFor="filter">Search: </label>
      <input
        placeholder="i.e Chirdonhead"
        name="filter"
        id="filter"
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="card">
        {stages
          .filter((i) => i.stage.toLowerCase().includes(filter))
          .map((item) => (
            <Link to={`/stage/${item.stageId}/${item.stage}`} key={item.href}>
              <p>{item.stage}</p>
            </Link>
          ))}
      </div>
    </>
  );
}

export default Stages;
