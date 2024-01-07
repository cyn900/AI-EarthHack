"use client";

import {useEffect, useState} from "react";

export default function Page() {
    const categories = [
        {
            name: 'Problem Significance',
            sliders: [
                ['Popularity', '#people impacted'],
                ['Growing', 'escalates overtime'],
                ['Urgent', 'create impact now'],
                ['Expensive', 'solving it saves money'],
                ['Frequent', 'not one just one']
            ]
        },
        {
            name: 'Solution Significance',
            sliders: [
                ['Completeness', 'circular econ. model'],
                ['Targeted', '7 pillars of circular econ.'],
                ['Novelty', 'not an existing solution'],
                ['Financial Impact', 'creates monetary value'],
                ['Implementability', 'feasibility & scalability']
            ]
        },
    ];

    const [categoryScores, setCategoryScores] = useState(
        categories.reduce((acc, category) => {
            const sliders = category.sliders;
            acc[category.name] = sliders.reduce((sliderAcc, slider, index) => {
                sliderAcc[slider] = 5;
                return sliderAcc;
            }, {});
            return acc;
        }, {})
    );

    const handleScoreChange = (category, slider, score) => {
        setCategoryScores((prevScores) => ({
            ...prevScores,
            [category]: { ...prevScores[category], [slider]: score },
        }));
    };

    const [categoryTotals, setCategoryTotals] = useState({});

    useEffect(() => {
        // Calculate category totals when categoryScores changes
        const totals = {};
        categories.forEach((category) => {
            totals[category.name] = Object.values(categoryScores[category.name]).reduce((sum, score) => sum + score, 0);
        });
        setCategoryTotals(totals);
    }, [categoryScores]);


    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content max-w-screen-xl text-center">
                <div className="max-w-screen-2xl w-full">
                    <h1 className="text-5xl font-bold"> Evaluation Personalization </h1>
                    <p className="py-6">*Each project gets a score out of the combined points of problem and solution, adjust success indicators based on your standards</p>
                    <div className="flex w-full">
                        {categories.map((category, index) => (
                            <div key={index} className="flex flex-col text-right mx-8 w-1/2">
                                <h1 className="text-2xl font-bold">{category.name} ({categoryTotals[category.name] || 0} points)</h1>
                                <div className="mx-4 mt-4">
                                    {category.sliders.map((slider, sliderIndex) => (
                                        <div key={sliderIndex} className="grid grid-cols-9">
                                            <label className="col-span-3">
                                                <div className="flex flex-col">
                                                    <span className="text-md font-bold">{slider[0]}</span>
                                                    <span className="text-xs">{slider[1]}</span>
                                                </div>
                                            </label>
                                            <div className="col-span-5 mx-4">
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={10}
                                                    step={1}
                                                    className="range range-primary"
                                                    value={categoryScores[category.name][slider]}
                                                    onChange={(e) => handleScoreChange(category.name, slider, parseInt(e.target.value, 10))}
                                                />
                                                <div className="w-full flex justify-between text-xs px-2">
                                                    <span>0</span>
                                                    <span>2</span>
                                                    <span>4</span>
                                                    <span>6</span>
                                                    <span>8</span>
                                                    <span>10</span>
                                                </div>
                                            </div>

                                            <p className="col-span-1">{categoryScores[category.name][slider]}pts </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary"> Submit </button>
                </div>
            </div>
        </div>
    )
}