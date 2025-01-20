import React from 'react';
import Pagination from '../Pagination/Pagination';
import Card from '../Card/Card';

function TestContent({
                         hasTestStarted,
                         totalPages,
                         currentPage,
                         setCurrentPage,
                         currentCards,
                         selectedCardIds,
                         setSelectedCardIds
                     }) {
    return (
        <>
            {hasTestStarted && (
                <>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <Card
                        selectedCardIds={selectedCardIds}
                        setSelectedCardIds={setSelectedCardIds}
                        cardList={currentCards}
                    />
                </>
            )}
        </>
    );
}

export default TestContent;
