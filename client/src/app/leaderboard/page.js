"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import API_URL from '../config';
import Report from "@/components/idea_report";


export default function Page() {
    const router = useRouter()
    const [ideas, setIdeas] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const res = await fetch(API_URL + '/get-idea-by-pagination?page=' + page + '&pageSize=' + pageSize);
                const data = await res.json();
                setIdeas(data.ideas);
                setTotalPages(data.totalPages);
                setSelectedIndex(0);

                console.log(data.ideas)
            } catch (error) {
                console.error('Error fetching ideas:', error);
            }
        }

        fetchIdeas().then(r => console.log(r));
    }, [page]);

    const handleSelectedIdeas = (index) => {
        setSelectedIndex(index);
    }

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-light_green">
            <div className="max-w-screen-2xl m-12">
                <div className="relative flex items-center">
                    <h1 className="font-bold text-2xl"> Idea Leaderboard </h1>
                    <Link href="/result" className="absolute left-[-30px] top-0 h-full text-2xl text-dark_green"> &#8592; </Link>
                </div>

                <div className="flex flex-row">
                    <div className="overflow-x-auto flex flex-col items-center">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="bg-middle_gray text-white rounded-3xl">
                                    <th>Rank</th>
                                    <th>Idea Name</th>
                                    <th>Category</th>
                                    <th>Points</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {ideas.map((idea, index) => (
                                <tr key={index} onClick={() => handleSelectedIdeas(index) } className={`hover:cursor-pointer ${index === selectedIndex ? "bg-middle_green" : "bg-white"}`}>
                                    <th className="font-bold">{(page-1) * pageSize + index + 1}</th>
                                    <td className="min-w-48 font-bold">{idea.newName}</td>
                                    <td className="min-w-40">
                                        <div className="text-dark_green text-xs bg-card_color w-fit py-1 px-5 rounded-3xl"> {idea.tags} </div>
                                    </td>
                                    <td className="font-bold">{idea.score} pt</td>
                                    <td>&#8250;</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="join">
                            <button className={`join-item btn ${page === 1 ? "btn-disabled" : ""}`} onClick={handlePrevPage}> &#8249; </button>
                            <button className="join-item btn">{page} / {totalPages}</button>
                            <button className={`join-item btn ${page === totalPages ? "btn-disabled" : ""}`} onClick={handleNextPage}> &#8250; </button>
                        </div>
                    </div>

                    <div className="mx-4">
                        {ideas.length > selectedIndex && <Report idea={ideas[selectedIndex]} />}
                    </div>
                </div>
            </div>
        </div>
    )
}