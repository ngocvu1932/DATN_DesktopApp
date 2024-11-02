import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import TextInput from '../text-input';
import useDebounce from '../../utils/useDebounce';
import {set} from 'date-fns';

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  totalPages,
  previousPage,
  nextPage,
  goToPage,
  limit,
  setLimit,
}) => {
  const [limitPage, setLimitPage] = useState<number>(limit ?? 0);
  const debouncedLimit = useDebounce(limitPage, 1000);

  useEffect(() => {
    setLimit && setLimit(debouncedLimit);
  }, [debouncedLimit]);

  return (
    <>
      <div>
        Tổng {currentPage} / {totalPages}
      </div>

      <div className="flex items-center">
        <div className="flex items-center mr-5">
          <span className="">Số hàng trên mỗi trang</span>
          <TextInput
            value={limitPage?.toString()}
            className="h-7 w-12"
            changeText={(text) => setLimitPage(Number(text))}
          />
        </div>
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className={`h-8 w-8 rounded-full border border-white text-white bg-slate-500 hover:bg-slate-800 flex items-center justify-center`}
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
          className="h-8 w-8 rounded-full border border-white text-white bg-slate-500 hover:bg-slate-800 flex items-center justify-center"
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
