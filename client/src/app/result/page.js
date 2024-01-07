"use client";

import {useState} from "react";
import PieChart from "@/components/PieChart";
import RadarChart from "@/components/RadarChart";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Select an option');

    const handleToggleDropdown = () => {
        setOpen(!open);
    };

    const handleOptionClick = (option) => {
        setSelectedValue(option);
        setOpen(false);
    };

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

    const [pillars, setPillars] = useState([
        {
            "name": "Water",
            "share": 0.4,
            "color": "#00FFFF"  // Cyan
        },
        {
            "name": "Value",
            "share": 0.3,
            "color": "#FF00FF"  // Purple
        },
        {
            "name": "Material",
            "share": 0.2,
            "color": "#00FF00"  // Green
        },
        {
            "name": "Society & Culture",
            "share": 0.05,
            "color": "#FFA500"  // Orange
        },
        {
            "name": "Energy",
            "share": 0.03,
            "color": "#FFFF00"  // Yellow
        },
        {
            "name": "Biodiversity",
            "share": 0.01,
            "color": "#FFC0CB"  // Pink
        },
        {
            "name": "Health & Wellbeing",
            "share": 0.01,
            "color": "#FF0000"  // Red
        }
    ]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="max-w-screen-2xl">
                <div className="flex flex-row">
                    <h1 className="font-bold text-2xl w-80"> Evaluation Results </h1>
                    <label className="flex flex-row justify-around w-full p-2 h-fit bg-green-100 rounded-xl">
                        <p className="text-gray-600"> Criteria </p>
                        <p> <strong>Problem</strong>: Popularity, Growth, Urgency, Cost-saving, Frequency </p>
                        <p> <strong>Solution</strong>: Completeness, Targeted, Novelty, Financial Impact, Implementability </p>
                    </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="card w-full m-4 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl"> Evaluation Goals </h2>
                            <p> Evaluate real-life use cases on how companies can implement the circular economy in their businesses. New ideas are also welcome, even if they are 'moonshots'.  </p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="card w-full m-4 bg-base-100 shadow-xl h-1/2">
                            <div className="card-body flex-row justify-between w-full items-center">
                                <div>
                                    <p className="text-md"> Total number of </p>
                                    <p className="font-bold text-2xl"> Relevant Ideas </p>
                                </div>
                                <p className="text-4xl font-bold text-right"> 1250 </p>
                            </div>
                        </div>

                        <div className="card w-full m-4 bg-base-100 shadow-xl h-1/2">
                            <div className="card-body">
                                <p className="text-md"> Most Popular Idea </p>
                                <p className="font-bold text-2xl"> Plastic Bottle Recycling </p>
                            </div>
                        </div>
                    </div>

                    <div className="card w-full m-4 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xs"> Popularity of Each Pillars of Circular Economy </h2>
                            <div>
                                <PieChart chartData={pillars} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold"> Idea Comparisons </h1>

                        <div className="flex justify-center items-center mt-8 rounded-md bg-gray-200">
                            <div className="flex flex-col justify-between items-center p-4">
                                <div className="flex flex-row items-end">
                                    <h1 className="text-3xl font-bold mx-4"> Top Ideas Comparisons </h1>

                                    <div className="relative z-10">
                                        <button onClick={handleToggleDropdown} className="btn w-48 flex justify-between">
                                            <span>{selectedValue}</span>
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"  viewBox="0 0 24 24" className="w-4 h-4">
                                                <path d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>

                                        {open && (
                                            <div className="absolute mt-= w-48 bg-white rounded-md overflow-hidden shadow-md z-10">
                                                {pillars.map((pillar, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleOptionClick(pillar.name)}
                                                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 w-full"
                                                    >
                                                        {pillar.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <RadarChart chartData={pillars} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-100 p-6 rounded-lg">
                        <div className="flex">
                            <h1 className="text-3xl font-bold"> Idea Leaderboard </h1>
                            <button className="btn min-h-0 max-h-6 rounded-md btn-primary ml-4"> All Entries </button>
                        </div>
                        {ideas.map((idea, index) => (
                            <div className="card m-4 bg-base-100 shadow-xl" key={index}>
                                <div className="card-body p-2 flex flex-row justify-between items-center">
                                    <div className="flex flex-row items-center">
                                        <h2 className="mr-6 text-xl font-bold"> {index + 1} </h2>
                                        <div>
                                            <h2 className="card-title"> {idea.problem} </h2>
                                            <p> {idea.solution} </p>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-800">{idea.score}pt</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}