// const
import PaginationConst from "../../constants/PaginationConst";
// component
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

const Pagination = ({
  total,
  sizePerPage,
  currentPage,
  path,
  hideMt = false,
}: {
  total: number;
  sizePerPage: number;
  currentPage: number;
  path: string;
  hideMt?: boolean;
  }) => {
  
  // 投稿数が1ページあたりの表示数以内の場合は出力しない
  if (total < sizePerPage) {
    return
  }

  const totalPage = Math.ceil(total / sizePerPage);
  const getPageNumber = (page: number | string, path: string) => {
      if (page === "...") {
        return <span>...</span>;
      }
      return (
        <Link
          href={`${path}/${page}`}
          key={page}
          className={`relative inline-flex items-center px-3 md:px-4 py-0 md:py-2 text-sm font-semibold focus:z-20
        ${
          currentPage == page
            ? "z-10 bg-gray-800 text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            : "transition-colors duration-200 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800  focus:outline-offset-0"
        }`}
        >
          {page}
        </Link>
      );
    };

  const getPages = (path:string) => {
    const pages: (number | string)[] = [];
    [...Array(PaginationConst.allBox)].map((_, i) => {
      let page: number | string = 0;
      const a = i + 1;
      const b = currentPage + a - 2;
      const c = totalPage - (PaginationConst.allBox - a);
      if (totalPage <= PaginationConst.allBox) {
        if (totalPage < a) {
          return;
        }
        page = a;
        pages.push(page);
      } else {
        if (a <= PaginationConst.breakPoint - 1) {
          page = Math.max(a, Math.min(b, c));
          pages.push(page);
        } else if (a == PaginationConst.breakPoint) {
          page = b < c ? "..." : c;
          pages.push(page);
        } else if (PaginationConst.breakPoint + 1 <= a) {
          page = c;
          pages.push(page);
        }
      }
    });
    return (
      pages.map((page) => getPageNumber(page, path))
    );
  };

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-8 sm:px-6 ${
        hideMt ? "" : "mt-8"
      }`}
    >
      <div className="flex flex-1 items-center justify-center">
        <div>
          <nav
            className="isolate inline-flex -space-x-px gap-x-2 md:gap-x-4"
            aria-label="Pagination"
          >
            {currentPage !== 1 && (
              <>
                <Link
                  href={`${path}/1`}
                  className="relative inline-flex items-center px-2 py-2 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
                >
                  <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href={`${path}/${Math.max(1, currentPage - 1)}`}
                  className="relative inline-flex items-center px-2 py-2 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              </>
            )}
            {getPages(path)}
            {currentPage !== totalPage && (
              <>
                <Link
                  href={`${path}/${Math.min(totalPage, currentPage + 1)}`}
                  className="relative inline-flex items-center px-2 py-2 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
                {/* サイドのページ */}
                <Link
                  href={`${path}/${totalPage}`}
                  className="relative inline-flex items-center px-2 py-2 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
                >
                  <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
