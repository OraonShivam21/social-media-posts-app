// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [post, setPost] = useState("");
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
    } catch (error) {
      setError("Error generating post");
    }
  };

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
    </div>
  );
};

export default App;
