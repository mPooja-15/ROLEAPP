import { Role } from "./";

export function configureFakeBackend() {
  const users = [
    {
      id: 1,
      username: "admin",
      password: "admin",
      firstName: "Admin",
      lastName: "User",
      role: Role.Admin,
    },
    {
      id: 2,
      username: "user",
      password: "user",
      firstName: "Pooja",
      lastName: "User",
      role: Role.User,
    }, {
      id: 3,
      username: "user",
      password: "user",
      firstName: "Kundan",
      lastName: "User",
      role: Role.User,
    },
  ];

  const realFetch = window.fetch;

  window.fetch = async function (url, opts) {
    const { headers, method, body } = opts;
    const authHeader = headers["Authorization"];
    const isLoggedIn =
      authHeader && authHeader.startsWith("Bearer fake-jwt-token");
    const roleString = isLoggedIn && authHeader.split(".")[1];
    const role = roleString ? Role[roleString] : null;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(500);

    if (url.endsWith("/users/authenticate") && method === "POST") {
      const params = JSON.parse(body);
      const user = users.find(
        (x) => x.username === params.username && x.password === params.password
      );
      if (!user) return error("Username or password is incorrect");
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `fake-jwt-token.${user.role}`,
      });
    }

    if (url.match(/\/users\/\d+$/) && method === "GET") {
      if (!isLoggedIn) return unauthorised();

      const urlParts = url.split("/");
      const id = parseInt(urlParts[urlParts.length - 1]);

      const currentUser = users.find((x) => x.role === role);
      if (id !== currentUser.id && role !== Role.Admin) return unauthorised();

      const user = users.find((x) => x.id === id);
      return ok(user);
    }

    if (url.endsWith("/users") && method === "GET") {
      if (role !== Role.Admin) return unauthorised();
      return ok(users);
    }

    // Pass through any requests not handled above
    const response = await realFetch(url, opts);
    return response;
  };

  // Private helper functions

  const ok = (body) => ({
    ok: true,
    text: () => Promise.resolve(JSON.stringify(body)),
  });
  const unauthorised = () => ({
    status: 401,
    text: () => Promise.resolve(JSON.stringify({ message: "Unauthorised" })),
  });
  const error = (message) => ({
    status: 400,
    text: () => Promise.resolve(JSON.stringify({ message })),
  });
}
