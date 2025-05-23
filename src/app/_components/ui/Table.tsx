'use client';

import Image from "next/image";

type Props = {
    data: { [key: string]: any }[];
    headers: string[];
    signUrls: { [key: string]: string };
    onDelete?: (id: string) => void;
};

export default function Table({ data, headers, signUrls, onDelete }: Props) {
    return (
        <div className="overflow-x-auto p-4">
            <table className="w-[1000px] text-sm text-white rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
                <thead>
                    <tr className="bg-white/5 uppercase text-center text-gray-300 text-sm border-b border-white/10">
                        {headers.map((header, index) => (
                            <th key={index} className="p-4 whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="text-center hover:bg-white/5 transition border-b border-white/5"
                        >
                            {headers.map((header, index) => {
                                const key = header.toLowerCase();
                                const value = row[key];

                                const isImageColumn = key === "icon" || key === "imgurl";

                                return (
                                    <td key={index} className="p-4 whitespace-nowrap">
                                        {isImageColumn ? (
                                            signUrls[row.id] ? (
                                                <Image
                                                    src={String(signUrls[row.id])}
                                                    alt={row.title ?? "Image"}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-[60px] h-[60px] bg-[#0f0c1d] rounded-lg" />

                                            )
                                        ) : (
                                            <span>{String(value).replace(/_/g, ' ')}</span>
                                        )}
                                    </td>
                                );
                            })}
                            <td className="p-4">
                                <button
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-4 py-2 rounded-full text-sm transition"
                                    onClick={() => onDelete?.(row.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
