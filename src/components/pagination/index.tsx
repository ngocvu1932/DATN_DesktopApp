import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (page: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({currentPage, totalPages, previousPage, nextPage, goToPage}) => {
  return (
    <>
      <div>
        Tổng {currentPage} / {totalPages}
      </div>
      <div className="flex items-center">
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className={`h-8 w-8 rounded-full border border-white bg-slate-300 hover:bg-slate-400 flex items-center justify-center`}
          title="Trang trước"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
          {/* &nbsp; Trở về */}
        </button>

        <div className="flex space-x-2 px-3">
          {currentPage > 3 && (
            <span onClick={() => goToPage(1)} className="cursor-pointer">
              1
            </span>
          )}
          {currentPage > 3 && <span>...</span>}
          {currentPage > 2 && (
            <span onClick={() => goToPage(currentPage - 2)} className="cursor-pointer">
              {currentPage - 2}
            </span>
          )}
          {currentPage > 1 && (
            <span onClick={() => goToPage(currentPage - 1)} className="cursor-pointer">
              {currentPage - 1}
            </span>
          )}
          <span className="font-bold text-blue-600">{currentPage}</span>
          {currentPage < totalPages && (
            <span onClick={() => goToPage(currentPage + 1)} className="cursor-pointer">
              {currentPage + 1}
            </span>
          )}
          {currentPage + 1 < totalPages && (
            <span onClick={() => goToPage(currentPage + 2)} className="cursor-pointer">
              {currentPage + 2}
            </span>
          )}
          {currentPage + 2 < totalPages && <span>...</span>}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="h-8 w-8 rounded-full border border-white bg-slate-300 hover:bg-slate-400 flex items-center justify-center"
          title="Trang sau"
        >
          {/* Tiếp &nbsp; */}
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </>
  );
};

export default Pagination;
