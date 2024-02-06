import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Questions from "./components/Questions";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100 ">
      <h1 className="text-6xl font-bold mb-10">Quizzical</h1>

      <Link to="/questions">
        <button className="px-16  py-5 mt-4 text-white bg-blue-500 rounded-2xl text-2xl ">
          Start quiz
        </button>
      </Link>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questions" element={<Questions />} />
    </Routes>
  </Router>
);

export default App;
