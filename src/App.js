import "./styles.css";
import { useEffect, useState } from "react";
import React from "react";
import { DebounceInput } from "react-debounce-input";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [stories, setStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetch("https://hn.algolia.com/api/v1/search_by_date?tags=story")
      .then((res) => res.json())
      .then((res) => setLatestStories(res.hits));
  }, []);

  const updateUserInput = (event) => {
    setUserInput(event.target.value);
    console.log(event);
  };

  const getResults = () => {
    setLoader(true);
    fetch("https://hn.algolia.com/api/v1/search?query=" + userInput)
      .then((res) => res.json())
      .then((res) => setStories(res.hits));
    setLoader(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getResults();
  };

  return (
    <div className="App">
      <h1>Joe`s Hackernews </h1>
      <div className="Header">
        <div className="Search">
          <form onSubmit={handleSubmit}>
            SEARCH:
            <DebounceInput
              onChange={updateUserInput}
              minLength={2}
              debounceTimeout={300}
              type="textarea"
              value={userInput}
              placeholder="what are you looking for..?"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="Loading">
          <Loader
            type="ThreeDots"
            color="#FFFFFF"
            height={100}
            width={100}
            timeout={2000} //3 secs
          />
        </div>
      </div>
      <div className="Boxes">
        <div className="Stories">
          <h2>Latest Stories:</h2>
          {latestStories.map((story) => (
            <li>
              <a href={story.url}>{story.title}</a>
              <br />
              Author: {story.author}
            </li>
          ))}
        </div>

        <div className="Stories">
          <h2>{userInput}</h2>
          {stories.map((story) => (
            <li>
              <a href={story.url}>{story.title}</a>
              <br /> Author: {story.author} Comments: {story.num_comments}
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}
