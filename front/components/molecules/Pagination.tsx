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
            className="isolate inline-flex -space-x-px gap-x-4"
            aria-label="Pagination"
          >
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
                      ? "relative z-10 inline-flex items-center bg-gray-800 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      : "relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0"
                  }
                >
                  {page}
                </Link>
              );
            })}
            <Link
              href={`${path}/${Math.min(totalPage, currentPage + 1)}`}
              className="relative inline-flex items-center px-2 py-2 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href={`${path}/${totalPage}`}
              className="relative inline-flex items-center px-2 py-2 text-gray-800 hover:text-white ring-1 ring-inset ring-gray-800 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 transition-colors duration-200"
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
