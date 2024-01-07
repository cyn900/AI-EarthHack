"use client";
import './globals.css';
import { useState } from 'react';
import Image from 'next/image';

import LargeButtons from "../components/large_buttons"; // Replace this import with the correct path

export default function Home() {

    return (
        <div className= "hero min-h-screen bg-base-200  bg-middle_green text-white">
        <div className= "hero-content flex-col " style={{paddingTop: '110px'}} >
            <img src ="logoround.png" width = "100" height = "100"/>
            <p className="title1" style={{paddingTop: '10px'}}> Welcome to Arbor!</p> 
            <h1 className = "content1_bold" style={{ width:'650px', textAlign: 'center', marginBottom: '10px'}}>Ever wished for an AI genie to make your evaluation process more streamlined, efficient and unbiased? Say hello to Arbor: your co-pilot on the journey to identify the next big idea.</h1>
            <ol className = "content1" style={{width:'650px', paddingBottom:"30px"}}>
                <li style={{ paddingBottom:"8px"}}>
                1. 💪 Make informed choices, fast! We harness the power of AI to create data-backed analysis, unearth trends, and spot opportunities
                </li>
                <li style={{ paddingBottom:"8px"}}>
                2. 🎯 Tailor-made evaluation is our jam. You're the director! Pick the metrics that matter to your vision – because your idea, your rules.
                </li>
                <li style={{ paddingBottom:"8px"}}>
                3. 🌈 Say goodbye to dull spreadsheets! We leverage data visualization to highlight your idea's potential and weak points
                </li>
            </ol>
            <LargeButtons />
        </div>
        </div>
    )
}