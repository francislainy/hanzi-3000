import './Pagination.css' 

function Pagination({ totalPages, currentPage, setCurrentPage }) {
    return <div className="pagination">
        {[...Array(totalPages).keys()].map(number => (
            <button
                key={number}
                className={number + 1 === currentPage ? 'pagination_button pagination_button__active' : 'pagination_button'}
                onClick={() => setCurrentPage(number + 1)}
            >
                {number + 1}
            </button>
        ))}
    </div>
}

export default Pagination;