'use client'

// ./src/app/page.js
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image'
import Link from "next/link";

export default function Home() {
    const [file, setFile] = useState(null);
    const [evaluationGoal, setEvaluationGoal] = useState('');
    const [loading, setLoading] = useState(false); // Track the loading state
    const [response, setResponse] = useState('');
    const handleChangeForm = (e) => {
        e.preventDefault()
        if (e.target.name === 'csv-form') {
            const selectedFile = e.target.files?.[0];
            setFile(selectedFile || null);
        }
    };

    const handleChangeTextArea = (e) => {
        e.preventDefault()
        if (e.target.name === 'evaluation-goal') {
            setEvaluationGoal(e.target.value);
        }
    }

    const handleSubmitForm = async(e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file');
        } else if (!file.name.endsWith('.csv')) {
            alert('Please select .csv file');
        } else {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('csvFile', file);
                formData.append('evaluationGoal', evaluationGoal);

                const response = await axios.post('http://localhost:4000/load-csv', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

                setResponse("File uploaded successfully. Upload status: " + response.data.status);
                window.location.href = "/intent";
            } catch (error) {
                console.error('Error sending form:', error);
                alert('Error sending form');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold" style={{ color: 'black' }}> How Arbor Works </h1>
                    <p className="py-2 font-bold" style={{ color: 'black' }}> 1. 📂 File Upload & Metric Prioritization: </p>
                    <p className="py-2" style={{ color: 'black' }}> Upload your ideas and prioritize evaluation criteria to fit your needs and standards. </p>
                    <p className="py-2 font-bold" style={{ color: 'black' }}> 2. 🤖 AI Analysis & Spam Purge </p>
                    <p className="py-2" style={{ color: 'black' }}> Our AI sorts and bins the spam - ensuring relevance of ideas and adherence to circular economy principles. </p>
                    <p className="py-2 font-bold" style={{ color: 'black' }}> 3. 📊 Weighted Metric Evaluation: </p>
                    <p className="py-2" style={{ color: 'black' }}> Your ideas face the metrics you prioritize. AI evaluates, quantitatively through indexes used across industries while also considering qualitative factors. </p>
                    <p className="py-2 font-bold" style={{ color: 'black' }}> 4. 🎉 Insightful Dashboard </p>
                    <p className="py-2" style={{ color: 'black' }}> Witness the winners! Spot popular categories, visualize idea performance and explore the leaderboard </p>
                    <p className="py-2 font-bold" style={{ color: 'black' }}> 5. 🏆 Detailed Insights </p>
                    <p className="py-2" style={{ color: 'black' }}> Dive into the best! Filter to see top performers of different categories and how they rated based on each metrics! </p>
                </div>
                <div className="card self-center bg-gray-300 shadow-xl">

                    <div className="card-body">
                        <h2 className="card-title"> Evaluation Goal </h2>
                        <textarea
                            className="textarea textarea-primary min-h-36"
                            placeholder="E.g. evaluate real-life use cases on how companies can implement the circular economy in their businesses. New ideas are also welcome, even if they are 'moonshots'."
                            onChange={handleChangeTextArea}
                            name="evaluation-goal"
                        ></textarea>

                        <h2 className="card-title mt-8"> Idea Database </h2>
                        <p> Insert a csv file with a separate columns for problem and solution by clicking on the area below. <Link href="https://drive.google.com/file/d/1cgeZPGsntnJckH7_ROSQm1JG5pFuE0u6/view" className="link"  > See example data file. </Link>  </p>
                        <form onSubmit={handleSubmitForm} encType="multipart/form-data" className="card-actions justify-end">
                            <input id='file-input' type="file" onChange={handleChangeForm} name="csv-form" className="file-input file-input-bordered file-input-primary w-full bg-gray-100" />
                            {
                                loading ? <span className="btn loading loading-spinner text-primary"></span> :
                                    <button className='btn btn-primary' type='submit'> Upload </button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
