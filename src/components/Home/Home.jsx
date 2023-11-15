import React, { useState, useEffect } from "react";
import { userService, authenticationService } from "../../services";

function HomePage() {
  const [currentUser, setCurrentUser] = useState(
    authenticationService.currentUserValue
  );
  const [userFromApi, setUserFromApi] = useState(null);

  useEffect(() => {
    userService
      .getById(currentUser.id)
      .then((userFromApi) => setUserFromApi(userFromApi));
  }, [currentUser.id]);
  return (
    <div>
      <h1>Home</h1>
      <p>
        The <strong>{currentUser.role}</strong> has Logged In.
      </p>
      <div>
      {currentUser.role} List:
        {userFromApi && (
          <ul>
            <li>
              {userFromApi.firstName} {userFromApi.lastName}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
