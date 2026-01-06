export function paginate<T>(
    array: T[],
    page: number,
    pageSize: number,
): {
    data: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
} {
    const totalItems = array.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const data = array.slice(startIndex, endIndex);

    return {
        data,
        page,
        pageSize,
        totalItems,
        totalPages,
    };
}
