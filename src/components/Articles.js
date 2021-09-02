import React from "react";
import {Link} from "react-router-dom";
import Loader from "./Loader";

function Articles(props) {
    
      function getDate(date) {
        let newDate =  new Date(date).toISOString().split('T')[0];
        return newDate;
       }

        let {articles, error} = props;
        
        if(error) {
            return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>
         }

        if(!articles) {
            return <Loader />
        }
        
        if(!articles.length){
            return <h2 className="text-red-500 text-center text-xl mt-8">No articles found</h2>
        }
        return(
            <article>
                {
                    articles.map(article => {
                        return (
                            <div key={article.slug} className="bg-green-200 flex justify-between my-3 w-full p-4 rounded-md">
                                <div>
                                    <div className="flex items-center my-2">
                                        <img src={article.author.image} alt={article.author.username} className="w-14 h-14 rounded-full object-cover"/>
                                        <div className="ml-4">
                                            <h5 className="text-indigo-900 font-bold text-xl mr-5">{article.author.username}</h5>
                                            <h6>{getDate(article.createdAt)}</h6>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-5 mt-5">{article.title}</h2>
                                    <Link to={`/articles/${article.slug}`}>
                                        <h4 className="btn btn-indigo inline-block">Read Article</h4>
                                    </Link>
                                </div>
                                <div className="flex items-center text-xl ml-5">
                                     <i className="far fa-heart text-red-700"></i>
                                     <span className="ml-2">{article.favoritesCount}</span>
                                </div>
                            </div>
                        )
                    }) 
                }
            </article>
        )
    }


export default Articles;