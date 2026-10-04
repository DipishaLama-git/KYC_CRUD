import React from 'react'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError} from '../../lib/api';
import '../../assets/styles/UsersPages.css';
const TotalUser = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    function loadUsers() {
        if (!token) return;
        api
        .getUsers(token)
        .then(setUsers)
        .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load users'));
    }

    useEffect(loadUsers, [token]);
  return (
    <>
        <div className="items-center h-30 max-w-3xl rounded-3xl bg-green-100 text-center m-auto mt-10">
            <p className="p-10 text-xl font-medium">Total User: {users.length}</p>
        </div>
    </>
  )
}

export default TotalUser