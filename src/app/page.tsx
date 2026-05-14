import { auth } from "@auth"
import { AuthenticatedView } from "@/components/authenticated-view"
import { LandingView } from "@/components/landing-view"

export default async function HomePage() {
  const session = await auth()

  return session ? (
    <AuthenticatedView session={session} />
  ) : (
    <LandingView />
  )
}
