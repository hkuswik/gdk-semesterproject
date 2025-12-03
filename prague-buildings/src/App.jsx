import { useEffect, useState } from "react";
import { fetchBuildings } from "./data/fetchWikidata";

function App() {
    const [results, setResults] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await fetchBuildings();
            setResults(data);
        }

        load();
    }, []);

    return (<div style={{ padding: "20px" }}>
        <h2>Prague Historical Buildings</h2>

        {!results && <p>Loading data from Wikidata...</p>}

        {results && (<pre style={{ maxHeight: "500px", overflow: "auto", background: "#eee", padding: "10px" }}>
                {JSON.stringify(results, null, 2)}
            </pre>)}
    </div>);
}

export default App;
