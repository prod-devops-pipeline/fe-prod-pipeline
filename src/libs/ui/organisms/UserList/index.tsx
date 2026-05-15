import { useEffect, useState } from "react";
import Pagination from "../../molecules/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, X, Pencil, Trash2, Filter } from "lucide-react";
import Button from "../../atoms/button";
import PaginationSkeleton from "../../molecules/paginationSkeleton";
import Modal from "../../molecules/Model";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "editor";
}

export interface IMetaData {
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
  currentPage: number;
}

export const fetchUsers = async (
  page: number,
  name: string,
  role: string,
  limit: number,
) => {
  const params = new URLSearchParams({
    name,
    page: page.toString(),
    role,
    limit: limit.toString(),
  });

  const response = await fetch(`http://localhost:3000/api/user?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching users.",
    ) as Error & {
      code: number;
    };
    error.code = response.status;
    throw error;
  }

  const result = await response.json();
  return result.data;
};

function UserList() {
  const [page, setPage] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [debouncedName, setDebouncedName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [deleteUserID, setDeleteUserID] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name);
      setPage(1);
    }, 1000);

    return () => clearTimeout(handler);
  }, [name]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page, debouncedName, role, limit],
    queryFn: () => fetchUsers(page, debouncedName, role, limit),
    staleTime: 1000 * 60 * 5,
    retry: 6,
  });
  const deleteUserRequest = async (userId: string) => {
    const result = await fetch(`http://localhost:3000/api/user/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.message || "Error while deleting product");
    }
    return result.json();
  };
  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowModel(false);
      setDeleteUserID("");
      toast.success("Product Deleted Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleEdit = (userId: string) => {
    navigate(`${userId}`);
  };

  const handleDelete = (userId: string) => {
    setShowModel(true);
    setDeleteUserID(userId);
  };

  const handleConformDelete = () => {
    deleteUser(deleteUserID);
  };

  if (isError) {
    return (
      <div className="text-red-500 text-center py-10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl p-10 py-10">
      <div className="mb-10 flex md:flex-row flex-col gap-4 justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-all"
            placeholder="Search by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {name && (
            <Button
              onClick={() => setName("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-500 hover:text-blue-400" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-row gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <Filter className="w-4 h-4" />
              <span>Role</span>
            </div>
            <select
              name="role"
              id="role"
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              value={role}
              className="w-40 border-2 p-2 rounded-md"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <Filter className="w-4 h-4" />
              <span>Limit</span>
            </div>
            <select
              name="limit"
              id="limit"
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              value={limit}
              className="w-40 border-2 p-2 rounded-md"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
          <div>
            <button
              className="bg-blue-500 rounded-lg p-2 text-white hover:bg-blue-600 "
              onClick={() => {
                navigate("createUser");
              }}
            >
              Add Uset +
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8">
                  <PaginationSkeleton />
                </td>
              </tr>
            ) : data?.users?.length > 0 ? (
              data.users.map((user: IUser) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : user.role === "editor"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  <p className="text-gray-400 text-lg">
                    No users found matching your criteria.
                  </p>
                  <Button
                    onClick={() => {
                      setName("");
                      setRole("");
                    }}
                    className="mt-4 !text-blue-600 font-medium hover:underline !bg-white"
                  >
                    Clear all filters
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModel && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModel(false);
          }}
          onConfirm={handleConformDelete}
          title="Delete User"
          message="This action is permanent. The User will be removed from the store."
          confirmText="Delete Now"
        ></Modal>
      )}
      {!isLoading &&
        data?.users?.length > 0 &&
        data?.metadata?.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              {...data.metadata}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
    </div>
  );
}

export default UserList;
