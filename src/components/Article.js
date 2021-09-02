import React from "react";
import Loader from "./Loader";

class Article extends React.Component{
    constructor(props){
        super();
        this.state = {
            article: "",
            error: ""
        };
    }

    componentDidMount() {
        this.getArticle();
    }

    getArticle = () => {
        
        fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${this.props.match.params.slug}`)
        .then((res) => {
            if(!res.ok)  {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({article: data.article });
        })
        .catch((err) => {
            this.setState({error: "Not able to fetch Articles"});
        });
    }
    
    getDate = (date) => {
        let newDate =  new Date(date).toISOString().split('T')[0];
         return newDate;
     }

    render() {
        let {error, article} = this.state;
            if(error) {
                return <h2 className="text-red-500 text-center text-xl mt-8">{error}</h2>
            }

            if(!article) {
                return <Loader />
            } 
            let {tagList} = article; 
        return (
            <main>

                {/* hero section */}
                <section className="px-20 bg-green-700 text-white py-12">
                    <h2 className="mt-2 mb-3 text-4xl">{article.title}</h2>
                    <p className="">{article.description}</p>
                    <div className="flex py-6 items-center">
                        <img src={article.author.image} alt={article.author.username} className="w-16 h-16 object-cover rounded-full"/>
                        <span className="mx-3">{article.author.username}</span>
                        <span className="mx-3">{this.getDate(article.createdAt)}</span>
                    </div>
                   <div className="flex">
                        {
                            tagList.map((tag) => {
                                return <span key={tag} className="mr-3 bg-blue-500 p-1 px-2 text-xs rounded-md">{tag}</span>
                            })
                        }

                   </div>
                </section> 

                {/* article body */}
                 <section className="px-20 py-12">
                    <p className="text-xl">{article.body}</p>
                </section>  
            </main>
        )
    }
}

export default Article;