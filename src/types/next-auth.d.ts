import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    phone?: string;
    user: {
      id: string;
      phone?: string;
      [key: string]: any;
    };
  }

  interface User {
    id: string;
    phone?: string;
    accessToken?: string;
    [key: string]: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    phone?: string;
    id?: string;
  }
}

