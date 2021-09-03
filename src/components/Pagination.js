function Pagiantion(props) {
  let { articlesCount, articlesPerPage, activePageIndex, updateCurrentPageIndex } = props;
  let numberOfPages = Math.ceil(articlesCount / articlesPerPage);

  let pagesArray = [];
  for(let i =1; i <= numberOfPages; i++ ) {
    pagesArray.push(i);
  } 
  return (
    <>
    <div className="flex">
    <p className="font-bold self-center cursor-pointer hover:shadow-lg" onClick={() => updateCurrentPageIndex(activePageIndex -1 < 1 ? 1 : activePageIndex - 1)}>{'< Prev'}</p>
      {pagesArray.map((page, i) => {
        return (
          <span
            key={page}
            className={
              activePageIndex === page
                ? 'bg-green-600 text-white py-2 px-4 mx-4 cursor-pointer hover:bg-green-500'
                : 'border border-gray-400 bg-green-50 py-2 px-4 mx-4 cursor-pointer hover:bg-blue-400'
            }
            onClick={() => updateCurrentPageIndex(page)}  
          >
            {page}
          </span>
        );
      })}
      <p className="font-bold self-center cursor-pointer hover:shadow-lg" onClick={() => updateCurrentPageIndex(activePageIndex + 1 > numberOfPages ? numberOfPages : activePageIndex + 1) }>{'Next >'}</p>
      </div>
    </>
  );
}
export default Pagiantion;
