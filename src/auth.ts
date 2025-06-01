import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Kiểm tra dữ liệu đầu vào
        const { email, password } = await signInSchema.parseAsync(credentials);
        // console.log("email", email);
        // console.log("password", password);
        // User test cứng
        const testUser = {
          id: "1",
          name: "Test User",
          email: "asaigon999@gmail.com",
          password: "test", // Mật khẩu test
        };

        if (email === testUser.email && password === testUser.password) {
          // Trả về thông tin user nếu đăng nhập thành công
          const loggeinUser = {
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
          };
          return loggeinUser;
        } else {
          // Trả về null nếu đăng nhập không thành công
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
