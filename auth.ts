import NextAuth from "next-auth"

const vaultAuthProvider = {
  id: "vaultauth",
  name: "VaultAuth",
  type: "oauth" as const,
  authorization: {
    url: `${process.env.VAULTAUTH_URL}/oauth/authorize`,
    params: { scope: "openid profile email" },
  },
  token: `${process.env.VAULTAUTH_URL}/oauth/token`,
  userinfo: `${process.env.VAULTAUTH_URL}/oauth/userinfo`,
  clientId: process.env.VAULTAUTH_CLIENT_ID,
  clientSecret: process.env.VAULTAUTH_CLIENT_SECRET ?? "",
  checks: ["pkce", "state"] as ["pkce", "state"],
  profile(profile: {
    sub: string
    name?: string
    email: string
    email_verified?: boolean
    picture?: string
  }) {
    return {
      id: profile.sub,
      name: profile.name ?? profile.email,
      email: profile.email,
      image: null,
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [vaultAuthProvider],
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
})
