'use client'

// ./src/app/page.js
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image'

export default function Home() {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // Track the loading state
    const [response, setResponse] = useState('');
    const handleChangeForm = (e) => {
        e.preventDefault()
        if (e.target.name === 'csv-form') {
            const selectedFile = e.target.files?.[0];
            setFile(selectedFile || null);
        }
    };

    const handleSubmitForm = async(e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file');
        } else if (!file.name.endsWith('.csv')) {
            alert('Please select .csv file');
        } else {
            try {
                const response = await axios.get('http://localhost:5000/healthcheck');
                console.log(response.data);

                setResponse(prompt + " running... backend status: " + response.data.status);
            } catch (error) {
                console.error('Error sending prompt:', error);
            }
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold"> How "NAME" Works </h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card self-center bg-gray-300 shadow-xl">
                    <figure className='w-full aspect-square max-h-64 bg-white'>
                        <div className='relative h-full aspect-square'>
                            <Image
                                src="/upload.gif"
                                alt="upload"
                                fill
                            />
                        </div>
                    </figure>

                    <div className="card-body">
                        <h2 className="card-title"> Upload File </h2>
                        <p> Please only upload .csv file  </p>
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
