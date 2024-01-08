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

    const [genRadarChart, setGenRadarChart] = useState(false);
    const [topIdeasByPillarProblem, setTopIdeasByPillarProblem] = useState([]);
    const [topIdeasByPillarSolution, setTopIdeasByPillarSolution] = useState([]);

    const handleToggleDropdown = () => {
        setOpen(!open);
    };

    const handleOptionClick = (option) => {
        setSelectedValue(option);
        setOpen(false);
    };

    const pillarColor = {
        "Water": "#DAE06D",
        "Materials": "#88C4A6",
        "Value": "#98C26C",
        "Society and Culture": "#728F4F",
        "Energy": "#3D6E5B",
        "Biodiversity": "#CCE1B6",
        "Health and Wellbeing": "#B9C7A7"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/get-evaluation-goal');
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
                // console.log("average idea score: " + JSON.stringify(response));
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

                const _pillars = [];
                for (const [key, value] of Object.entries(response.data.tagFreq)) {
                    if (key in pillarColor) {
                        _pillars.push({
                            name: key,
                            color: pillarColor[key],
                            share: value
                        });
                    } else {
                        _pillars.push({
                            name: key,
                            color: "#00FF00",
                            share: value
                        });
                    }
                }

                setPillars(_pillars);
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
                // console.log("top ideas: " + JSON.stringify(response.data.top5Rows));
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

                if (response.data.top5Rows.length === 0) {
                    setGenRadarChart(false);
                    return;
                } else {
                    setGenRadarChart(true);
                }

                const _ideas_by_pillar_problem = {
                    pillarName: selectedValue + " Problem",
                    series: [],
                    categories: ["Popularity", "Growth", "Urgency", "Expensive", "Frequency"],
                };

                const _ideas_by_pillar_solution = {
                    pillarName: selectedValue + " Solution",
                    series: [],
                    categories: ["Completeness", "Targeted", "Novelty", "Financial Impact", "Implementability"],
                };

                for (const idea of response.data.top5Rows) {
                    _ideas_by_pillar_problem.series.push({
                        name: idea.newName,
                        data: [
                            idea.problemPopularityScore,
                            idea.problemGrowingScore,
                            idea.problemUrgentScore,
                            idea.problemExpenseScore,
                            idea.problemFrequentScore
                        ]
                    });
                    _ideas_by_pillar_solution.series.push({
                        name: idea.newName,
                        data: [
                            idea.solutionCompletenessScore,
                            idea.solutionTargetScore,
                            idea.solutionNoveltyScore,
                            idea.solutionFinImpactScore,
                            idea.solutionImplementabilityScore
                        ]
                    });
                }
                setTopIdeasByPillarProblem(_ideas_by_pillar_problem);
                setTopIdeasByPillarSolution(_ideas_by_pillar_solution);

            } catch (error) {
                console.error('Error fetching top ideas:', error);
            }
        };

        fetchData();
    }, [selectedValue]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen mt-16">
            <div className="max-w-screen-2xl">
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold text-2xl w-80"> Evaluation Results </h1>
                    {/* You can open the modal using document.getElementById('ID').showModal() method */}
                    <button className="btn bg-light_forest hover:bg-dark_forest border-light_forest" onClick={()=>document.getElementById('my_modal_3').showModal()}> New Evaluation </button>
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box text-center">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg"> This Action Cannot be Undone!! </h3>
                            <p className="py-4"> <strong>You won’t be able to access the current evaluation when you start a new evaluation.</strong> If you want to re-evaluate current ideas with new priorities, click “Modify Metrics”. If you have new ideas to evaluate, click “Start New Evaluation” to clear current files and start fresh! </p>
                            <button
                                className="btn btn-primary w-4/5 m-4 text-lg bg-light_forest hover:bg-dark_forest border-light_forest"
                                onClick={() => window.location.href = '/intent'}
                            > Modify Metrics </button>
                            <button
                                className="btn btn-primary w-4/5 m-4 text-lg bg-white text-dark_forest hover:bg-light_forest border-light_forest"
                                onClick={() => window.location.href = '/'}
                            > Start New Evaluation </button>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>

                <label className="flex flex-row justify-around w-full p-2 h-fit bg-green-100 rounded-xl mt-4">
                    <p className="text-gray-600"> Criteria </p>
                    <p> <strong>Problem</strong>: Popularity, Growth, Urgency, Cost-saving, Frequency </p>
                    <p> <strong>Solution</strong>: Completeness, Targeted, Novelty, Financial Impact, Implementability </p>
                </label>


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
                                <PieChart chartData={pillars} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="mt-6">
                        <h1 className="text-3xl font-bold"> Idea Comparisons </h1>

                        <div className="flex justify-center items-center mt-8 rounded-md bg-green-100">
                            <div className="flex flex-col justify-between items-center p-4">
                                <div className="flex flex-row items-end">
                                    <h1 className="text-3xl font-bold mx-4"> Top Ideas Comparisons </h1>

                                    <div className="relative z-10">
                                        <button onClick={handleToggleDropdown} className="btn w-56 flex justify-between">
                                            <span>{selectedValue}</span>
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"  viewBox="0 0 24 24" className="w-4 h-4">
                                                <path d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>

                                        {open && (
                                            <div className="absolute mt-4 w-56 bg-white rounded-md overflow-hidden shadow-md z-10">
                                                {Object.entries(pillarColor).map(([key, value], index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleOptionClick(key)}
                                                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 w-full"
                                                    >
                                                        {key}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    { genRadarChart
                                        ?
                                        <div className="carousel w-full">
                                            <div id="slide1" className="carousel-item relative w-full justify-center">
                                                <RadarChart chartData={topIdeasByPillarProblem} />
                                                <div className="absolute flex flex-row-reverse justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                                    <a href="#slide2" className="btn btn-circle">❯</a>
                                                </div>
                                            </div>
                                            <div id="slide2" className="carousel-item relative w-full justify-center">
                                                <RadarChart chartData={topIdeasByPillarSolution} />
                                                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                                    <a href="#slide1" className="btn btn-circle">❮</a>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <p> No Relevant Idea </p> }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-100 p-6 rounded-lg">
                        <div className="flex">
                            <h1 className="text-3xl font-bold"> Idea Leaderboard </h1>
                            <button className="btn min-h-0 max-h-6 rounded-md btn-primary ml-4 bg-light_forest hover:bg-dark_forest border-light_forest" onClick={()=>document.getElementById('my_modal_4').showModal()}> All Entries </button>
                            <dialog id="my_modal_4" className="modal">
                                <div className="modal-box text-center">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold text-lg"> Feature is under construction!! </h3>
                                    <p> Check Figma to see the result </p>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>

                        </div>
                        {topIdeas.map((idea, index) => (
                            <div className="card m-4 bg-base-100 shadow-xl" key={index}>
                                <div className="card-body p-2 flex flex-row justify-between items-center">
                                    <div className="flex flex-row items-center">
                                        <h2 className="mr-6 text-xl font-bold"> {index + 1} </h2>
                                        <div>
                                            <h2 className="card-title"> {idea.newName} </h2>
                                            <p>{idea.summary.length > 50 ? idea.summary.slice(0, 50) + '...' : idea.summary}</p>
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