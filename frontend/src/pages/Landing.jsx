import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Landing() {
const images = [
hero1,
hero2,
hero3
];

const [currentImage, setCurrentImage] =
useState(0);

useEffect(() => {
const interval = setInterval(() => {
setCurrentImage(
(prev) =>
(prev + 1) % images.length
);
}, 3000);

return () => clearInterval(interval);

}, []);

 
return ( <div
  className={`min-h-screen bg-[#0B1120] text-white`}
>

  <nav
  className="
    sticky top-0 flex justify-between items-center px-10 py-5 bg-white/3 backdrop-blur-lg border-b border-white/20 shadow-lg">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
      SkillMatch
    </h1>

    <div className="flex gap-6 items-center">
      <a href="#features">Features</a>
      <a href="#about">About</a>



      <Link to="/login">
        <button className="px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-500/20">
          Login
        </button>
      </Link>

      <Link to="/signup">
        <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500">
          Signup
        </button>
      </Link>
    </div>
  </nav>

  <section className="flex flex-col md:flex-row items-center justify-between px-16 py-20">

    <div className="max-w-2xl">
      <h1 className="text-6xl font-bold leading-tight">
        Find Your
        <span className="text-blue-400">
          {" "}Dream Job{" "}
        </span>
        with AI
      </h1>

      <p className="mt-6 text-xl text-gray-300">
        Smart ATS resume analysis,
        AI job matching, and recruiter
        analytics in one platform.
      </p>

      <div className="mt-8 flex gap-4">
        <Link to="/signup">
          <button className="bg-blue-600 px-6 py-3 rounded-xl text-lg hover:bg-blue-500 shadow-lg">
            Get Started
          </button>
        </Link>

        <Link to="/login">
          <button className="border border-gray-500 px-6 py-3 rounded-xl text-lg hover:bg-white/10">
            Explore
          </button>
        </Link>
      </div>
    </div>

    <div className="mt-16 md:mt-0 relative">

      <img
        src={images[currentImage]}
        alt="hero"
        className="w-[520px] h-[350px] object-cover rounded-3xl shadow-2xl transition-all duration-700"
      />

      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
        <p className="font-semibold text-lg">
          AI Powered Hiring
        </p>
        <p className="text-sm text-gray-300">
          Smart recruitment platform
        </p>
      </div>

    </div>

  </section>

  <section
  id="features"
  className="px-16 py-20 bg-[#111827]"
>
  <h2 className="text-4xl font-bold text-center mb-4">
    Powerful Features
  </h2>

  <p className="text-gray-400 text-center mb-14">
    Everything you need for smarter hiring
    and faster placements
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:scale-105 transition duration-300">
      <div className="text-4xl mb-4">
        🤖
      </div>
    
      <h3 className="text-2xl font-semibold mb-3">
        AI ATS Analysis
      </h3>
    
      <p className="text-gray-400">
        Upload resumes and instantly get ATS
        compatibility score, strengths,
        weaknesses and suggestions.
      </p>
    </div>
    
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:scale-105 transition duration-300">
      <div className="text-4xl mb-4">
        🎯
      </div>
    
      <h3 className="text-2xl font-semibold mb-3">
        Smart Job Matching
      </h3>
    
      <p className="text-gray-400">
        Match candidates with relevant jobs
        using AI-powered skill analysis and
        filtering.
      </p>
    </div>
    
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:scale-105 transition duration-300">
      <div className="text-4xl mb-4">
        📊
      </div>
    
      <h3 className="text-2xl font-semibold mb-3">
        Recruiter Dashboard
      </h3>
    
      <p className="text-gray-400">
        Manage job postings, applicants,
        hiring pipeline, and analytics in
        one place.
      </p>
    </div>
      </div>
    </section>

    <section className="px-16  py-20 bg-[#0B1120]">
      <h2 className="text-4xl font-bold text-center mb-14">
        Trusted by Future Professionals
      </h2>
    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
    
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8">
      <h3 className="text-5xl  font-bold text-blue-400">
        10K+
      </h3>
      <p className="mt-3 text-gray-400">
        Candidates
      </p>
    </div>
    
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8">
      <h3 className="text-5xl font-bold text-purple-400">
        500+
      </h3>
      <p className="mt-3 text-gray-400">
        Recruiters
      </p>
    </div>
    
    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
      <h3 className="text-5xl font-bold text-green-400">
        95%
      </h3>
      <p className="mt-3 text-gray-400">
        Match Accuracy
      </p>
    </div>
    
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8">
      <h3 className="text-5xl font-bold text-yellow-400">
        24/7
      </h3>
      <p className="mt-3 text-gray-400">
        AI Support
      </p>
    </div>
      </div>
    </section>
    <section
  id="about"
  className="px-16 py-20 bg-[#111827]"
>
  <div className="max-w-5xl mx-auto text-center">

<h2 className="text-4xl font-bold mb-6">
  About SkillMatch
</h2>

<p className="text-gray-300 text-lg leading-8">
  SkillMatch is an AI-powered job portal
  designed to bridge the gap between
  talented candidates and recruiters.
  Traditional hiring is slow, manual,
  and inefficient. SkillMatch simplifies
  this process using intelligent resume
  analysis, ATS scoring, and smart job
  recommendations.
</p>

<p className="text-gray-400 text-lg leading-8 mt-6">
  Candidates can build profiles, upload
  resumes, apply for jobs, and receive
  AI-based feedback. Recruiters can post
  jobs, review applicants, shortlist
  candidates, and manage the hiring
  pipeline efficiently.
</p>

  </div>
</section>

    <footer className="bg-black border-t border-gray-800 px-16 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
    
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        SkillMatch
      </h2>
    
      <p className="mt-4 text-gray-400">
        AI-powered hiring platform connecting
        candidates and recruiters with smart
        resume analysis and job matching.
      </p>
    </div>
    
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Product
      </h3>
    
      <ul className="space-y-2 text-gray-400">
        <li>Features</li>
        <li>ATS Analysis</li>
        <li>Dashboard</li>
      </ul>
    </div>
    
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Company
      </h3>
    
      <ul className="space-y-2 text-gray-400">
        <li>About</li>
        <li>Careers</li>
        <li>Contact</li>
      </ul>
    </div>
    
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Contact
      </h3>
    
      <ul className="space-y-2 text-gray-400">
        <li>Email: support@skillmatch.ai</li>
        <li>Phone: +91 XXXXX XXXXX</li>
        <li>India</li>
      </ul>
    </div>

    </div>
    
    <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
        © 2026 SkillMatch. All rights reserved.
    </div>
    </footer>
</div>
);
}

export default Landing;
