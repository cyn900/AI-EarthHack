'use client'

// ./src/app/page.js
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from 'next/navigation'
import API_URL from '../config';

export default function Home() {
    const router = useRouter()
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

                const response = await axios.post(API_URL + '/load-csv', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

                setResponse("File uploaded successfully. Upload status: " + response.data.status);
                if (response.status === 200) {
                    router.push('/intent');
                    // window.location.href = "/intent";
                }
            } catch (error) {
                console.error('Error sending form:', error);
                alert('Error sending form');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div data-theme="light" className="hero min-h-screen " >
            <div className="hero-content flex-col lg:flex-row" >
                <div className="text-center lg:text-left bg-middle_green " style={{ padding: '100px', width: "60%"}}>
                    <h1 className="subtitle1" style={{  color: 'white', marginTop: '40px', marginBottom: '20px'}}> How Arbor Works </h1>
                    <p className="py-2 font-bold" style={{ marginLeft: '-20px',color: 'white', marginBottom: '-10px'}}> 1. 📂 File Upload & Metric Prioritization: </p>
                    <p className="py-2" style={{ color: 'white',marginRight: '-20px', marginBottom: '10px'}}> Upload your ideas and prioritize evaluation criteria to fit your needs and standards. </p>
                    <p className="py-2 font-bold" style={{ marginLeft: '-20px', color: 'white' , marginBottom: '-10px',marginRight: '-20px'}}> 2. 🤖 AI Analysis & Spam Purge </p>
                    <p className="py-2" style={{ color: 'white', marginBottom: '10px' }}> Our AI sorts and bins the spam - ensuring relevance of ideas and adherence to circular economy principles. </p>
                    <p className="py-2 font-bold" style={{ marginLeft: '-20px', color: 'white' , marginBottom: '-10px',marginRight: '-20px'}}> 3. 📊 Weighted Metric Evaluation: </p>
                    <p className="py-2" style={{ color: 'white' , marginBottom: '10px' }}> Your ideas face the metrics you prioritize. AI evaluates, quantitatively through indexes used across industries while also considering qualitative factors. </p>
                    <p className="py-2 font-bold" style={{ marginLeft: '-20px', color: 'white' , marginBottom: '-10px',marginRight: '-20px'}}> 4. 🎉 Insightful Dashboard </p>
                    <p className="py-2" style={{ color: 'white'  , marginBottom: '10px'}}> Witness the winners! Spot popular categories, visualize idea performance and explore the leaderboard </p>
                    <p className="py-2 font-bold" style={{ marginLeft: '-20px',color: 'white' , marginBottom: '-10px',marginRight: '-20px'}}> 5. 🏆 Detailed Insights </p>
                    <p className="py-2" style={{ color: 'white' , marginBottom: '10px'}}> Dive into the best! Filter to see top performers of different categories and how they rated based on each metrics! </p>
                    <p className="py-2" style={{ color: 'white' , marginLeft: '-30px', marginRight: '-30px'}}> ⚠️ Disclaimer: Our AI evaluation tool is a guide, not a replacement for human insight.  </p>

                </div>
                <div className=" text-center lg:text-left self-center bg-white">

                    <div className="">
                        <h2 className="title1" style={{ marginTop: '60px' }}> Evaluation Goal </h2>
                        <h2 className="subtitle2" style={{ color: '#6D6D6D', marginLeft: '90px', marginTop:"20px", marginBottom:"-80px"}}> Evaluation Goal (max 30 words) </h2>
                        <textarea
                            className="textarea textarea-primary min-h-36 boarder-color-light_gray" 
                            style={{ margin: '90px', width: "74%"}}
                            placeholder="E.g. evaluate real-life use cases on how companies can implement the circular economy in their businesses. New ideas are also welcome, even if they are 'moonshots'."
                            onChange={handleChangeTextArea}
                            name="evaluation-goal"
                        ></textarea>

                        <h2 className="subtitle2"style={{ color: '#6D6D6D', marginLeft:'90px', marginTop:'-40px'}}> Idea Database </h2>
                        <p style={{  marginLeft:'90px', marginTop:'10px'}}> Insert a csv file with a separate columns for problem and solution by clicking on the area below. <Link href="https://drive.google.com/file/d/1cgeZPGsntnJckH7_ROSQm1JG5pFuE0u6/view" className="link"  > See example data file. </Link>  </p>
                        <form style={{  marginLeft:'90px', marginTop:'10px', width: "74%"}} onSubmit={handleSubmitForm} encType="multipart/form-data" className="card-actions justify-end">
                            <input id='file-input' type="file" onChange={handleChangeForm} name="csv-form" className="file-input file-input-primary w-full bg-gray-100" />
                            {
                                loading ? <span className="btn loading loading-spinner text-primary"></span> :
                                    <button className='buttong' type='submit' style={{marginTop:'20px'}}> Next </button>
                                    
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
