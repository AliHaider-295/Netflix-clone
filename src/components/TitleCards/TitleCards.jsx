import { Link } from "react-router-dom";
import "./TitleCards.css";
import { useEffect, useRef, useState } from "react";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDQwYzc1YTU2ZDhmNjU2NjdlMWY1MmNjODk5OGVlNSIsIm5iZiI6MTczNTU2ODk2NC45NSwic3ViIjoiNjc3MmFlNDQ5OGYyZjgyZmM0OTI3MmRlIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.8JgOk6N1NreAO_ub-gyl5f18fiM6XnTy8cxo6p-JflU",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${
            category ? category : "now_playing"
          }?language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setApiData(data.results || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();

    const currentRef = cardsRef.current;
    currentRef.addEventListener("wheel", handleWheel);

    return () => {
      currentRef.removeEventListener("wheel", handleWheel);
    };
  }, [category]);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => (
          <Link to={`/player/${card.id}`} className="card" key={index}>
            <img
              src={
                card.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
                  : "/path/to/fallback-image.jpg"
              }
              alt={card.original_title || "Movie Poster"}
            />
            <p>{card.original_title || "Unknown Title"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
