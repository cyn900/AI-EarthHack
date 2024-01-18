import RadarChartSingle from "@/components/RadarChartSingle";
import {useState} from "react";

export default function Report({ idea }) {

    const radarChartProblemData = {
        name: "Problem Importance",
        categories: ["Popularity", "Growth", "Urgency", "Expensive", "Frequency"],
        series: [{
            name: "Problem Importance",
            data: [idea.problemPopularityScore, idea.problemGrowingScore, idea.problemUrgentScore, idea.problemExpenseScore, idea.problemFrequentScore]
        }]
    }

    const radarChartSolutionData = {
        name: "Solution Significance",
        categories: ["Completeness", "Financial Impact", "Implementability", "Targeted", "Novelty"],
        series: [{
            data: [idea.solutionCompletenessScore, idea.solutionTargetScore, idea.solutionNoveltyScore, idea.solutionFinImpactScore, idea.solutionImplementabilityScore]
        }]
    }

    const [selectedChart, setSelectedChart] = useState("problem");

    const handleSelectedChart = (chart) => {
        setSelectedChart(chart);
    }

    return (
        <div className="bg-white rounded-lg max-h-[80%] p-8 max-w-screen-md overflow-y-auto">
            <h1 className="font-bold">{idea.newName}</h1>

            <label className="form-control mt-2">
                <div className="text-xs">{idea.summary}</div>
            </label>

            <div className="text-dark_green font-bold mt-4">
                Total Score: {idea.score}pt
            </div>

            <div className="flex flex-row justify-between">
                <div className={`hover:cursor-pointer ${selectedChart === "problem" ? "opacity-100" : "opacity-30"}`} onClick={() => handleSelectedChart("problem")}>
                    <RadarChartSingle chartData={radarChartProblemData} />
                </div>
                <div className={`hover:cursor-pointer ${selectedChart === "solution" ? "opacity-100" : "opacity-30"}`} onClick={() => handleSelectedChart("solution")}>
                    <RadarChartSingle chartData={radarChartSolutionData} />
                </div>
            </div>

            {selectedChart === "problem" ? (
                <label className="form-control mt-[-2rem]">
                    <div className="label">
                        <span className="label-text font-bold text-sm">Problem Statement</span>
                    </div>
                    <textarea className="textarea bg-card_color h-20 text-xs" readOnly={true} value={idea.problem}></textarea>
                </label>
            ) : (
                <label className="form-control mt-[-2rem]">
                    <div className="label">
                        <span className="label-text font-bold text-sm">Solution Statement</span>
                    </div>
                    <textarea className="textarea bg-card_color h-20 text-xs" readOnly={true} value={idea.solution}></textarea>
                </label>
            )}

            {selectedChart === "problem" ? (
                <div className="mt-4">
                    <div className="collapse collapse-arrow shadow-lg mt-4 p-0">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.problemGrowingScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2" />
                        <div className="collapse-title text-sm font-bold">
                            Popularity
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.problemPopularityExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.problemGrowingScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2" />
                        <div className="collapse-title text-sm font-bold">
                            Growing
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.problemGrowingExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.problemUrgentScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2"  />
                        <div className="collapse-title text-sm font-bold">
                            Urgent
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.problemUrgentExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.problemExpenseScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2"  />
                        <div className="collapse-title text-sm font-bold">
                            Expensive
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.problemExpenseExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.problemFrequentScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2"  />
                        <div className="collapse-title text-sm font-bold">
                            Frequent
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.problemFrequentExplanation} </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="collapse collapse-arrow shadow-lg mt-4 p-0">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.solutionCompletenessScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2" />
                        <div className="collapse-title text-sm font-bold">
                            Completeness
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.solutionCompletenessExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.solutionFinImpactScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2" />
                        <div className="collapse-title text-sm font-bold">
                            Financial Impact
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.solutionFinImpactExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.solutionImplementabilityScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2"  />
                        <div className="collapse-title text-sm font-bold">
                            Implementability
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.solutionImplementabilityExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.solutionTargetScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2"  />
                        <div className="collapse-title text-sm font-bold">
                            Targeted
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.solutionTargetExplanation} </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow shadow-lg mt-4">
                        <p className="absolute top-[17px] right-10 text-sm"> { idea.solutionNoveltyScore } / 10 </p>
                        <input type="checkbox" name="my-accordion-2"  />
                        <div className="collapse-title text-sm font-bold">
                            Novelty
                        </div>
                        <div className="collapse-content text-xs">
                            <p> {idea.solutionNoveltyExplanation} </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
