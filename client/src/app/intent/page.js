"use client";

import {useState} from "react";

export default function Page() {
    const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10']
    const [categoryScores, setCategoryScores] = useState(categories.reduce((acc, category) => ({ ...acc, [category]: 3 }), {}));

    const handleScoreChange = (category, score) => {
        setCategoryScores((prevScores) => ({ ...prevScores, [category]: score }));
    };



    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-screen-2xl">
                    <h1 className="text-5xl font-bold"> Evaluation Personalization </h1>
                    <p className="py-6">*Each project gets a score out of 100 points, adjust success indicators based on your standards</p>

                    <div className="max-w-screen-2xl grid grid-cols-2 gap-4">
                        {categories.map((category, index) => (
                            <div key={index} className="flex flex-row mb-4">
                                <h1 className="text-right">{category}</h1>
                                <div className="mx-4">
                                    <input type="range"
                                           min={0}
                                           max="5"
                                           step="1"
                                           className="range range-primary"
                                           value={categoryScores[category]}
                                           onChange={(e) => handleScoreChange(category, parseInt(e.target.value, 10))}
                                    />
                                    <div className="w-full flex justify-between text-xs px-2">
                                        <span>0</span>
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                        <span>5</span>
                                    </div>
                                </div>
                                <p> {categoryScores[category]} / 5 </p>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary"> Submit </button>
                </div>
            </div>
        </div>
    )
}