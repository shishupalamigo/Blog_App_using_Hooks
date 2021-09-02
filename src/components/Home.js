import {Link} from "react-router-dom";

function Home() {
    return (
        <main>
            <div className="text-center p-12 mt-12 bg-yellow-100">
                <h2 className="text-5xl font-bold mb-10">Welcome to Alt Blog</h2>
                <Link to="/articles">
                    <button className="btn btn-indigo">View Articles</button>
                </Link>
            </div>
        </main>
        
    )
}

export default Home;