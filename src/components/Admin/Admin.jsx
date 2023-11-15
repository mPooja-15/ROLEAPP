import React, { useState, useEffect } from "react";
import { authenticationService, userService } from "../../services";

function AdminPage() {
  const [users, setUsers] = useState(null);
  const userRole = authenticationService.currentUserValue;
  useEffect(() => {
    userService.getAll().then((fetchedUsers) => {
      setUsers(fetchedUsers);
    });
  }, []);
  return (
    <div>
      <h1>Admin</h1>
      <p>This page can only be accessed by admin</p>
      <div>
        All User accessed:
        {users && userRole.role == "Admin" && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
