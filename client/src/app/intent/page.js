"use client";

import {useEffect, useState} from "react";

export default function Page() {
    const categories = [
        { name: 'Problem Significance', sliders: ['Popularity', 'Growing', 'Urgent', 'Expensive', 'Frequent', 'Others'] },
        { name: 'Solution Significance', sliders: ['Popularity', 'Growing', 'Urgent', 'Expensive', 'Frequent', 'Others'] },
    ];

    const [categoryScores, setCategoryScores] = useState(
        categories.reduce((acc, category) => {
            const sliders = category.sliders;
            acc[category.name] = sliders.reduce((sliderAcc, slider, index) => {
                sliderAcc[slider] = index === sliders.length - 1 ? 0 : 30;
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
            <div className="hero-content text-center">
                <div className="max-w-screen-2xl">
                    <h1 className="text-5xl font-bold"> Evaluation Personalization </h1>
                    <p className="py-6">*Each project gets a score out of 100 points, adjust success indicators based on your standards</p>
                    <div className="max-w-screen-2xl flex w-full">
                        {categories.map((category, index) => (
                            <div key={index} className="flex flex-col text-right mx-8">
                                <h1 className="text-2xl font-bold">{category.name} ({categoryTotals[category.name] || 0} points)</h1>
                                <div className="mx-4 mt-4">
                                    {category.sliders.map((slider, sliderIndex) => (
                                        <div key={sliderIndex} className="grid grid-cols-6">
                                            <label className="col-span-1">{slider}</label>
                                            <div className="col-span-4 mx-4">
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={50}
                                                    step={10}
                                                    className="range range-primary"
                                                    value={categoryScores[category.name][slider]}
                                                    onChange={(e) => handleScoreChange(category.name, slider, parseInt(e.target.value, 10))}
                                                />
                                                <div className="w-full flex justify-between text-xs px-2">
                                                    <span>0</span>
                                                    <span>10</span>
                                                    <span>20</span>
                                                    <span>30</span>
                                                    <span>40</span>
                                                    <span>50</span>
                                                </div>
                                            </div>

                                            <p className="col-span-1">{categoryScores[category.name][slider]} / 50 </p>
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