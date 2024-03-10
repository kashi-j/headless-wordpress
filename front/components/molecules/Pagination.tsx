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
}: {
  total: number;
  sizePerPage: number;
  currentPage: number;
  path: string;
  }) => {
  const totalPage = Math.ceil(total / sizePerPage);
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-8 sm:px-6">
      <div className="flex flex-1 items-center justify-center">
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Link
              href={`${path}/1`}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href={`${path}/${Math.max(1, currentPage - 1)}`}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            {[...Array(PaginationConst.allBox)].map((_, i) => {
              let page;
              const a = i + 1;
              const b = currentPage + a - 2;
              const c = totalPage - (PaginationConst.allBox - a);
              if (totalPage <= PaginationConst.allBox) {
                if (totalPage < a) {
                  return;
                }
                page = a;
              } else {
                if (a <= PaginationConst.breakPoint - 1) {
                  page = Math.max(a, Math.min(b, c));
                } else if (a == PaginationConst.breakPoint) {
                  page = b < c ? "..." : c;
                } else if (PaginationConst.breakPoint + 1 <= a) {
                  page = c;
                }
              }

              return (
                <Link
                  href={`${path}/${page}`}
                  key={i}
                  className={
                  currentPage == page
                    ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }
                >
                  {page}
                </Link>
              );
            })}
            <Link
              href={`${path}/${Math.min(totalPage, currentPage + 1)}`}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href={`${path}/${totalPage}`}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
