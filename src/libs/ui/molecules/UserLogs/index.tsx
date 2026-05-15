import { useQuery } from "@tanstack/react-query";

interface IUser {
    _id: string;
    name: string;
    email: string;
}

interface IUserLog {
    _id: string;
    userId: IUser;
    loginTime: string;
    logoutTime: string | null;
    isActive: boolean;
}

interface ILoginLogsResponse {
    logs: IUserLog[];
}

const fetchLoginLogs = async (): Promise<ILoginLogsResponse> => {
    const response = await fetch("http://localhost:3000/api/auth/getLoginLogs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error("Failed to fetch login logs") as Error & { code?: number };
        error.code = response.status;
        throw error;
    }

    const result = await response.json();
    return result.data;
};

function UserLogs() {

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["login-logs"],
        queryFn: fetchLoginLogs,
        staleTime: 1000 * 60 * 5,
        retry: 3,
    });

    const logs = data?.logs || [];

    const formatDateTime = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    };

    if (isLoading) {
        return (
            <div className="w-full px-2 sm:px-4 py-6">
                <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-500">
                    Loading user logs...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full px-2 sm:px-4 py-6">
                <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-red-500">
                    Error: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 sm:px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Activity Logs</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Track user login and logout activity
                </p>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                <table className="w-full min-w-[950px] text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">User</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Login Time</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Logout Time</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr
                                    key={log._id}
                                    className="border-t hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold uppercase">
                                                {log.userId?.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800 capitalize">
                                                    {log.userId?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {log.userId?._id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {log.userId?.email}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {formatDateTime(log.loginTime)}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {formatDateTime(log.logoutTime)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${log.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {log.isActive ? "Active" : "Logged Out"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                                    No logs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserLogs;
