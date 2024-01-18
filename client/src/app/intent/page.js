"use client";

import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/navigation";
import API_URL from '../config';

export default function Page() {
    const router = useRouter();
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

    const [categorySignificance, setCategorySignificance] = useState([50, 50]);

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

    const [loading, setLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL + '/get-api-status');
                console.log(response.data);
                setApiStatus(response.data);
            } catch (error) {
                console.error('Error getting status:', error);
            }
        };

        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 1000); // 5 minutes in milliseconds

        return () => clearInterval(intervalId);
    }, []);

    const handleSignificanceChange = (event, index) => {
        const value = event.target.value;
        const newSignificance = [0, 0];

        newSignificance[index] = value;
        newSignificance[1 - index] = 100 - value;
        setCategorySignificance(newSignificance);
    }

    const handleScoreChange = (category, slider, score) => {
        setCategoryScores((prevScores) => ({
            ...prevScores,
            [category]: { ...prevScores[category], [slider]: score },
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true)
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

            const response = await axios.post(API_URL + '/load-user-rating', {
                rating: transformedCategoryScores,
                problemSignificance: categorySignificance[0],
                solutionSignificance: categorySignificance[1]
            });
            const json = response.data;

            if (response.status !== 200) {
                console.error('Error sending form:', json);
                alert('Error sending form');
            } else {
                setLoading(false);
                router.push('/result');
            }
        } catch (error) {
            console.error('Error sending form:', error);
            alert('Error sending form');
        } finally {
            if (loading) {
                alert('No relevant ideas found. Please try again.');
                setLoading(false);
            }
        }
    }

    if (loading) {
        return (
            <div data-theme="light" className="hero min-h-screen bg-white">
                <div className="hero-content flex-col max-w-screen-lg">
                    <Image
                        src="/Growing_Tree.gif"
                        alt="Growing Tree"
                        width={500}
                        height={500}
                    />
                    <p> Loading ... </p>
                </div>
            </div>
        );
    } else {
        return (
            <div data-theme="light" className="hero min-h-screen">
                <div className="hero-content max-w-screen-xl text-center">
                    <div className="max-w-screen-2xl w-full">
                        <h1 className="text-5xl font-bold text-dark_forest"> Evaluation Personalization </h1>
                        <p className="py-6" style={{color: 'black'}}>*Each project gets a score out of the combined
                            points of problem and solution, adjust success indicators based on your standards</p>
                        <div className="flex w-full">
                            {categories.map((category, index) => (
                                <div key={index} className="flex flex-col text-right mx-8 w-1/2"
                                     style={{color: 'black'}}>
                                    <h1 className="text-2xl font-bold">{category.name}
                                        <input type="numeric"
                                               className="input input-ghost m-2 max-w-16 bg-card_color text-center"
                                               style={{ appearance: 'none', MozAppearance: 'textfield' }}
                                               min={0}
                                               max={100}
                                               value={categorySignificance[index]}
                                               onChange={(event) => handleSignificanceChange(event, index)} />
                                        %</h1>
                                    <div className="mx-4 mt-4">
                                        {category.sliders.map((slider, sliderIndex) => (
                                            <div key={sliderIndex} className="grid grid-cols-9">
                                                <label className="col-span-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-md font-bold"
                                                              style={{color: 'black'}}>{slider[0]}</span>
                                                        <span className="text-xs"
                                                              style={{color: 'black'}}>{slider[1]}</span>
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
                        <div className="">
                            <button className="btn btn-primary mx-4" onClick={() => {
                                router.push('/start');
                            }} style={{
                                backgroundColor: '#DFEDE7',
                                marginTop: '10pt',
                                border: 'none',
                                paddingLeft: '30px',
                                paddingRight: '30px',
                                color: '#3D6F5B'
                            }}> Prev
                            </button>

                            <div className="tooltip" data-tip={`${apiStatus?.apiStatus === 'ready' ? "Ready" : `Loading (${apiStatus?.resolvedCalls} / ${apiStatus?.totalCalls})`}`}>
                                <button className={`btn btn-primary mx-4 bg-light_green ${apiStatus?.apiStatus === 'ready' ? "" : "btn-disabled"}`} onClick={handleSubmit} style={{
                                    backgroundColor: apiStatus?.apiStatus ? '#98C26C' : '#6D6D6D',
                                    marginTop: '30pt',
                                    border: 'none',
                                    paddingLeft: '30px',
                                    paddingRight: '30px',
                                    color: 'white'
                                }}> Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}