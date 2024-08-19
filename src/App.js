import { APSApp } from './components/apsApp';
import json2023 from './data2023.json';
import json2024 from './data2024.json';
import './App.css';

function App() {

  const convertJson = (json) => {
    return json.map(value => {
      return {
        date: new Date(value.date), 
        time: value.time, 
        ico: value.ico, 
        sro: value.sro, 
        mudr: value.mudr, 
        executor: value.executor
      };
    });
  };
  
  const data2023 = convertJson(json2023);
  const data2024 = convertJson(json2024);

  return (
    <APSApp data={{data2023, data2024}}/>
  );
}

export default App;
