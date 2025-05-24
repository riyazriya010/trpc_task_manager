'use client';

import Image from "next/image";
import { type ReactNode } from "react";

type Props = {
    data: { [key: string]: any }[];
    headers: string[];
    signUrls: { [key: string]: string };
    onDelete?: (id: string) => void;
    handlers?: (row: { [key: string]: any }) => { handler: () => void; name: string; icon?: ReactNode }[];
};

export default function Table({ data, headers, signUrls, handlers, onDelete }: Props) {
    return (
        <div className="overflow-x-auto p-4">
            <table className="w-[1000px] text-sm text-white rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
                <thead>
                    <tr className="bg-white/5 uppercase text-center text-gray-300 text-sm border-b border-white/10">
                        {headers.map((header, index) => (
                            <th key={index} className="p-4 whitespace-nowrap">{header}</th>
                        ))}
                        {(handlers || onDelete) && <th className="p-4">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="text-center hover:bg-white/5 transition border-b border-white/5">
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
                                                    unoptimized
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

                            {(handlers || onDelete) && (
                                <td className="p-4">
                                    <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                                        {handlers
                                            ? handlers(row).map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    className="bg-[#6E40FF] text-white px-3 py-1 rounded-[4px] flex items-center gap-2"
                                                    onClick={action.handler}
                                                >
                                                    {action.icon && <span>{action.icon}</span>}
                                                    <span>{action.name}</span>
                                                </button>
                                            ))
                                            : onDelete && (
                                                <button
                                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-4 py-2 rounded-full text-sm transition"
                                                    onClick={() => onDelete(row.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

