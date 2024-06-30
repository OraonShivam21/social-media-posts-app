// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/generate-post`,
        { prompt }
      );
      setPost(response.data.post);
      setError(null);

      await axios.post("http://localhost:3000/api/save-post", {
        prompt: response.data.post,
      });
    } catch (error) {
      setError("Error generating post");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      setError("Error fetching posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Generate Social Media Posts</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit">Generate Post</button>
      </form>
      {error && <p>{error}</p>}
      {post && (
        <div>
          <h2>Generate post:</h2>
          <p>{post}</p>
        </div>
      )}
      <div>
        <h2>Previous Posts:</h2>
        {posts.map((p, index) => {
          <div key={index}>
            <p>{p[0]} - {p[1]} - {p[2]}</p>
          </div>
        })}
      </div>
    </div>
  );
};

export default App;
