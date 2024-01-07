"use client";

import {useState} from "react";

export default function Page() {
    const [ideas, setIdeas] = useState([
        {
            problem: "Problem 1",
            solution: "Solution 1",
            score: 95
        },
        {
            problem: "Problem 2",
            solution: "Solution 2",
            score: 90
        },
        {
            problem: "Problem 3",
            solution: "Solution 3",
            score: 85
        },
        {
            problem: "Problem 4",
            solution: "Solution 4",
            score: 80
        },
        {
            problem: "Problem 5",
            solution: "Solution 5",
            score: 75
        },
    ]);

    return (
        <div>
            <h1> Idea Leaderboard </h1>

            {ideas.map((idea, index) => (
                <div className="card m-4 w-96 bg-base-100 shadow-xl" key={index}>
                    <div className="card-body p-2 flex flex-row justify-between">
                        <div className="flex flex-row items-center">
                            <h2 className="mr-6 text-xl font-bold"> {index + 1} </h2>
                            <div>
                                <h2 className="card-title"> {idea.problem} </h2>
                                <p> {idea.solution} </p>
                            </div>
                        </div>
                        <h2>{idea.score} pts</h2>
                    </div>
                </div>
            ))}
        </div>
    )
}