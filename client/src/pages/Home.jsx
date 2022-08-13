import "./home.scss";
import axios from "axios";
import { useState, useEffect } from "react";

const Home = () => {
  const [data, setData] = useState(() => null);
  const token = JSON.parse(localStorage.getItem("user")).token;
  useEffect(() => {
    if (token) {
      const getData = async () => {
        try {
          let response = await axios.get(process.env.REACT_APP_BACKEND_URL, { headers: { Authorization: `Bearer ${token}` } });
          console.log(response.data);
          setData(() => response.data);
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, []);
  return (
    <div className="homePage">
      <div className="homeContainer">
        <p> {data && data}</p>
      </div>
    </div>
  );
};

export default Home;
