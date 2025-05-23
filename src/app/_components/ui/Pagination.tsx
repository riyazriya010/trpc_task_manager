

type Props = {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded bg-white/10 text-white disabled:opacity-30"
            >
                Prev
            </button>

            <p className="text-white text-sm">Page {currentPage} of {totalPages}</p>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm rounded bg-white/10 text-white disabled:opacity-30"
            >
                Next
            </button>
        </div>
    );
}