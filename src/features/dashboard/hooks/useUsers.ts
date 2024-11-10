// src/features/dashboard/hooks/useUsers.ts
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../shared";
import type { User } from "../../../common";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]); // Using common User type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
          throw new Error("No authenticated user");
        }

        const userListDoc = await getDoc(doc(db, "userList", "all"));
        if (!userListDoc.exists()) {
          throw new Error("User list not found");
        }

        const usersRaw = userListDoc.data().users as {
          id: string;
          name: string;
        }[];

        const usersList = usersRaw.map((user) => ({
          id: user.id,
          email:
            user.id === currentUserId ? auth.currentUser?.email || "" : user.id,
          name: user.name || user.id,
          monthlyStepGoal: 300000, // Added this required field
        }));

        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
};
