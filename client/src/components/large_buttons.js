import Link from "next/link";

export default function LargeButtons() {
    return (
        <Link href="/start" className="text-dark_forest p-4 bg-white rounded-xl button_text button text-center">
            <p> Try out the magic  </p>
        </Link>

        // <div className="btn bg-white text-dark_green button_text hover-">
        //     <p> Try out the magic  </p>
        // </div>
    )
}