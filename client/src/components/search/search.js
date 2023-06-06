import React, { useState } from "react";


export default function Search() {
  const [bookData, setBookData] = useState([]);
  const [searchBy, setSearchBy] = useState("Title");
  const [query, setQuery] = useState("");
  const [bookItems, setBookItems] = useState([]);


  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  function handleSearchByChange(e) {
    setSearchBy(e.target.value);
  } 

  async function searchBooks() {
    console.log(searchBy);
    if (query.trim() !== "") {
      if (searchBy === "Title") {
        try {
          const response = await fetch(`/api/search/book/title/${query}`);
          const data = await response.json();
          setBookData(data);
          const bookItems = [];
          for (const element of data) {
            const currId = element.id;
            const frontThumbnailResponse = await fetch(`/api/search/thumbnail/${element.front_thumbnail}`);
            const backThumbnailResponse = await fetch(`/api/search/thumbnail/${element.back_thumbnail}`);
            console.log(frontThumbnailResponse)
            const bookDisplay = {
              bookData: element,
              frontThumbnail: frontThumbnailResponse.url,
              backThumbnail: backThumbnailResponse.url,
            };
            bookItems.push(bookDisplay);
          }
          console.log(bookItems);
          setBookItems(bookItems);
        } catch (error) {
          console.error(error);
        }
      } else if (searchBy === "Description") {
        try {
          const response = await fetch(`/api/search/book/description/${query}`);
          const data = await response.json();
          setBookData(data);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      setBookData([]);
    }
  }

  return (
    <div>
      <select onChange={handleSearchByChange}>
        <option value="Title">Search By Title</option>
        <option value="Description">Search by Description</option>
      </select>
      <input type="text" value={query} onChange={handleQueryChange} />
      <button onClick={searchBooks}>Search</button>
      {bookItems.map((book) => (
  <div key={book.id}>
    <h1>{book.bookData.title}</h1>
    <h2>{book.bookData.description}</h2>
    <img src={book.frontThumbnail} alt="front thumbnail"/>
    <img src={book.backThumbnail} alt="back thumbnail"/>
  </div>
))}
    </div>
  );
}