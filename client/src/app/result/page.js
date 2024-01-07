"use client";

import {useEffect, useState} from "react";
import PieChart from "@/components/PieChart";
import RadarChart from "@/components/RadarChart";
import axios from "axios";


export default function Page() {
    const [open, setOpen] = useState(false);
    const [evaluationGoal, setEvaluationGoal] = useState('');
    const [relevantIdeasNumber, setRelevantIdeasNumber] = useState(0);
    const [averageIdeaScore, setAverageIdeaScore] = useState('');
    const [pillars, setPillars] = useState([]);
    const [topIdeas, setTopIdeas] = useState([]);
    const [selectedValue, setSelectedValue] = useState('Water');
    const [topIdeasByPillar, setTopIdeasByPillar] = useState([]);

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

    const pillarColor = {
        "Water": "#DAE06D",
        "Material": "#88C4A6",
        "Value": "#98C26C",
        "Society & Culture": "#728F4F",
        "Energy": "#3D6E5B",
        "Biodiversity": "#CCE1B6",
        "Health & Wellbeing": "#B9C7A7"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/get-evaluation-goal');
                console.log(response);
                setEvaluationGoal(response.data.evaluationGoal);
            } catch (error) {
                console.error('Error fetching evaluation goal:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/get-relevant-ideas-number');
                // console.log("relevant ideas number: " + JSON.stringify(response));
                setRelevantIdeasNumber(response.data.relevantIdeasNumber);
            } catch (error) {
                console.error('Error fetching relevant ideas number:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
       const fetchData = async () => {
           try {
                const response = await axios.get('http://localhost:4000/get-average-idea-score');
                console.log("average idea score: " + JSON.stringify(response));
                setAverageIdeaScore(response.data.averageIdeaScore);
           } catch (error) {
               console.error('Error fetching average idea score:', error);
           }
       };

         fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/get-tag-frequency');
                console.log("pillars: " + response);
                setPillars(response.data.tagFreq);
            } catch (error) {
                console.error('Error fetching pillars:', error);
            }
        };

        fetchData();
    },[]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/get-top-5-ideas-by-category', {
                    params: {
                        category: "All"
                    }
                });
                console.log("top ideas: " + response);
                setTopIdeas(response.data.top5Rows);
            } catch (error) {
                console.error('Error fetching top ideas:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/get-top-5-ideas-by-category', {
                    params: {
                        category: selectedValue
                    }
                });
                console.log("top ideas by pillar: " + response);
                setTopIdeasByPillar(response.data.top5Rows);
            } catch (error) {
                console.error('Error fetching top ideas:', error);
            }
        };
    }, [selectedValue]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mt-16">
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
                            <p> {evaluationGoal}  </p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="card w-full m-4 bg-base-100 shadow-xl h-1/2">
                            <div className="card-body flex-row justify-between w-full items-center">
                                <div>
                                    <p className="text-md"> Total number of </p>
                                    <p className="font-bold text-2xl"> Relevant Ideas </p>
                                </div>
                                <p className="text-4xl font-bold text-right"> {relevantIdeasNumber} </p>
                            </div>
                        </div>

                        <div className="card w-full m-4 bg-base-100 shadow-xl h-1/2">
                            <div className="card-body flex-row justify-between w-full items-center">
                                <div>
                                    <p className="text-md"> Grading Standards </p>
                                    <p className="font-bold text-2xl"> Average Idea Points </p>
                                </div>
                                <p className="text-4xl font-bold text-right"> {averageIdeaScore} </p>
                            </div>
                        </div>
                    </div>

                    <div className="card w-full m-4 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xs"> Popularity of Each Pillars of Circular Economy </h2>
                            <div>
                                {/*<PieChart chartData={pillars} />*/}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="mt-6">
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
                                                {Object.entries(pillarColor).map(([key, value], index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleOptionClick(key)}
                                                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 w-full"
                                                        style={{ backgroundColor: value }}
                                                    >
                                                        {key}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    {/*<RadarChart chartData={pillars} />*/}
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