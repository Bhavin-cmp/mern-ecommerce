import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  blockUser,
  fetchAllUser,
  unblockUser,
} from "../../redux/slices/userSlice";
import DataTable from "react-data-table-component";

export const AdminUser = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, [dispatch]);

  //Handle for blocking user
  const handleBlock = (userId, days = null) => {
    // days : null for permanent, or number of days for temporary
    if (days === 0) {
      // Unblock user
      dispatch(blockUser({ userId, days: 0 }));
    } else {
      // Block user
      dispatch(blockUser({ userId, days }));
    }
    dispatch(fetchAllUser()); // refresh the user list after block the user
    alert(
      days
        ? `Block user ${userId} for ${days} days (implement backend)`
        : `Block user ${userId} permanently (implement backend)`
    );
  };

  const handleUnblock = async (userId) => {
    await dispatch(unblockUser(userId));
    dispatch(fetchAllUser()); // refresh user list after unblock the user
  };

  const columns = [
    { name: "ID", selector: (row) => row._id, sortable: true, width: "180px" },
    { name: "Username", selector: (row) => row.userName, sortable: true },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Blocked",
      selector: (row) => (row.blocked ? "Yes" : "No"),
      sortable: true,
      width: "80px",
    },
    {
      name: "Block Expires In",
      selector: (row) => {
        if (!row.blocked) return "_";
        if (!row.blockExpires) return "Permanent";
        const expires = new Date(row.blockExpires);
        const now = new Date();
        const diff = Math.ceil((expires - now) / (1000 * 60 * 60 * 24)); //convert to days
        return diff > 0 ? `${diff} days(s)` : "Expired";
      },
      sortable: true,
      width: "100px",
    },
    {
      name: "Admin",
      selector: (row) => (row.isAdmin ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {row.blocked ? (
            <button
              className="!bg-green-600 text-white px-3 py-1 rounded hover:!bg-green-700"
              onClick={() => handleUnblock(row._id)}
            >
              Unblock
            </button>
          ) : (
            <button
              className="!bg-yellow-600 text-white px-3 py-1 rounded hover:!bg-yellow-700"
              onClick={() => {
                const days = prompt(
                  "Block for how many days? Leave blank for permanent."
                );
                if (days === null) return;
                if (days === "") handleBlock(row._id, null);
                else if (!isNaN(days) && Number(days) > 0)
                  handleBlock(row._id, Number(days));
                else
                  alert("Please enter a valid number of days or leave blank.");
              }}
            >
              Block
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
      //   allowOverflow: true,
      //   button: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl text-sky-900 font-bold mb-6">Manage Users</h2>
      <span className="text-sm text-gray-700">
        Total User is {users.length}
      </span>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <DataTable
        columns={columns}
        data={users}
        pagination
        highlightOnHover
        pointerOnHover
        noDataComponent="No users found."
      />
    </div>
  );
};
