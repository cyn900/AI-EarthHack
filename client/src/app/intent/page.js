"use client";

import {useEffect, useState} from "react";
import axios from "axios";

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const transformedCategoryScores = Object.keys(categoryScores).reduce((acc, categoryName) => {
                const sliderScores = categoryScores[categoryName];

                Object.keys(sliderScores).forEach((slider) => {
                    const sliderName = slider.split(',')[0].trim(); // Extract only the slider name

                    if (!acc[sliderName]) {
                        acc[sliderName] = sliderScores[slider];
                    }
                });

                return acc;
            }, {});

            const response = await axios.post('http://localhost:4000/load-user-rating', { rating: transformedCategoryScores });
            const json = response.data;
            console.log(json);
            window.location.href = "/result";
        } catch (error) {
            console.error('Error sending form:', error);
            alert('Error sending form');
        }
    }

    return (
        <div className="hero min-h-screen bg-white">
            <div className="hero-content max-w-screen-xl text-center">
                <div className="max-w-screen-2xl w-full">
                    <h1 className="title1"> Evaluation Personalization </h1>
                    <p className="py-6" style={{ color: 'black' }}>*Each project gets a score out of the combined points of problem and solution, adjust success indicators based on your standards</p>
                    <div className="flex w-full subtitle1">
                        {categories.map((category, index) => (
                            <div key={index} className="flex flex-col text-right mx-4 w-1/2 content2" style={{ color: 'black' , marginTop: '15pt'}}>
                                <h1 className="text-2xl font-bold color-dark_gray">{category.name} ({categoryTotals[category.name] || 0} points)</h1>
                                <div className="mx-4 mt-4">
                                    {category.sliders.map((slider, sliderIndex) => (
                                        <div key={sliderIndex} className="grid grid-cols-9 " style={{ color: 'black' , marginTop: '10pt'}}>
                                            <label className="col-span-3">
                                                <div className="flex flex-col">
                                                    <span className="text-md font-bold" style={{ color: 'black' }}>{slider[0]}</span>
                                                    <span className="button_text2" style={{ color: 'black' }}>{slider[1]}</span>
                                                </div>
                                            </label>
                                            <div className="col-span-5 mx-4 button_text2">
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

                    <div className="">
                        <button className="btn btn-primary mx-4" onClick={() => { window.location.href = '/start' }} style={{ backgroundColor: '#DFEDE7' , marginTop: '10pt', border : 'none', paddingLeft : '30px', paddingRight : '30px', color:'#3D6F5B' }}> Prev </button>
                        <button className="btn btn-primary mx-4" onClick={handleSubmit} style={{ backgroundColor: '#98C26C' , marginTop: '30pt', border : 'none', paddingLeft : '30px', paddingRight : '30px', color:'white' }}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    )
}