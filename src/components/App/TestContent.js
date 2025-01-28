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
                         setSelectedCardIds,
    score,
    setScore
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
                        score={score}
                        setScore={setScore}
                    />
                </>
            )}
        </>
    );
}

export default TestContent;
