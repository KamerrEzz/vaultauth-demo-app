import { getSession } from '@/lib/session'
import styles from './page.module.css'

export default async function HomePage() {
  const session = await getSession()

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <VaultAuthIcon size={22} />
            <span>VaultAuth Demo</span>
          </div>
          {session && (
            <a href="/api/logout" className={styles.logoutBtn}>
              Sign out
            </a>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {session ? (
          <LoggedInView session={session} />
        ) : (
          <LandingView />
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          This demo shows how to integrate{' '}
          <strong style={{ color: '#818cf8' }}>VaultAuth</strong> as an OAuth 2.0 / OIDC provider.
          <br />
          <span style={{ color: '#4a5568', fontSize: '0.8rem' }}>
            No auth libraries used — raw fetch + manual PKCE.
          </span>
        </p>
      </footer>
    </div>
  )
}

// --- Logged-in view ---

function LoggedInView({ session }: { session: { sub: string; email: string; name?: string; picture?: string; email_verified?: boolean } }) {
  const initials = session.name
    ? session.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : session.email[0].toUpperCase()

  return (
    <div className={styles.loggedIn}>
      <div className={styles.welcomeCard}>
        <div className={styles.cardHeader}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.welcomeTitle}>Welcome back!</div>
            <div className={styles.welcomeSub}>You have successfully authenticated via VaultAuth.</div>
          </div>
        </div>

        <div className={styles.userDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Name</span>
            <span className={styles.detailValue}>{session.name ?? '—'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>{session.email}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>User ID</span>
            <span className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {session.sub}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Verified</span>
            <span className={styles.detailValue}>
              {session.email_verified ? (
                <span style={{ color: '#68d391' }}>✓ Yes</span>
              ) : (
                <span style={{ color: '#fc8181' }}>✗ No</span>
              )}
            </span>
          </div>
        </div>

        <div className={styles.sessionNote}>
          <span style={{ color: '#4a5568' }}>Session stored in an </span>
          <code>httpOnly</code>
          <span style={{ color: '#4a5568' }}> cookie. Access token never exposed to the browser.</span>
        </div>

        <a href="/api/logout" className={styles.logoutBtnCard}>
          Sign out
        </a>
      </div>
    </div>
  )
}

// --- Landing view ---

function LandingView() {
  return (
    <div className={styles.landing}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.badge}>OAuth 2.0 + PKCE + OIDC</div>
        <h1 className={styles.heroTitle}>
          Integrate <span className={styles.highlight}>VaultAuth</span>
          <br />
          in minutes
        </h1>
        <p className={styles.heroSub}>
          This demo shows how any third-party app can use VaultAuth as its identity provider —
          the same way you&apos;d use &ldquo;Login with Google&rdquo;. No auth libraries. Just fetch.
        </p>

        <a href="/api/login" className={styles.loginBtn}>
          <VaultAuthIcon size={20} color="#fff" />
          Login with VaultAuth
        </a>
      </div>

      {/* Flow diagram */}
      <div className={styles.flowSection}>
        <h2 className={styles.flowTitle}>How the OAuth flow works</h2>
        <div className={styles.flow}>
          <FlowStep
            number="1"
            title="User clicks login"
            description="App generates PKCE code_verifier + code_challenge (SHA-256) and stores them in an httpOnly cookie."
            code={`const verifier = randomBytes(32).toString('base64url')\nconst challenge = createHash('sha256')\n  .update(verifier).digest('base64url')`}
          />
          <FlowArrow />
          <FlowStep
            number="2"
            title="Redirect to VaultAuth"
            description="Browser is redirected to VaultAuth's /oauth/authorize with the challenge, state, client_id, and scopes."
            code={`GET /oauth/authorize\n  ?response_type=code\n  &client_id=...\n  &code_challenge=...\n  &code_challenge_method=S256`}
          />
          <FlowArrow />
          <FlowStep
            number="3"
            title="User authenticates"
            description="VaultAuth shows the login screen. User enters credentials. VaultAuth redirects back with a one-time authorization code."
            code={`GET /callback\n  ?code=abc123\n  &state=xyz789`}
          />
          <FlowArrow />
          <FlowStep
            number="4"
            title="Server exchanges code"
            description="Your server (not the browser) sends the code + code_verifier to get an access_token. The token never touches the browser."
            code={`POST /oauth/token\n  grant_type=authorization_code\n  code=abc123\n  code_verifier=...`}
          />
          <FlowArrow />
          <FlowStep
            number="5"
            title="Fetch user info"
            description="Server calls /oauth/userinfo with the Bearer token to get the user's claims (sub, email, name, etc.)."
            code={`GET /oauth/userinfo\nAuthorization: Bearer <access_token>`}
          />
          <FlowArrow />
          <FlowStep
            number="6"
            title="Session established"
            description="User info is stored in an httpOnly session cookie. User is redirected to the app, now authenticated."
            code={`Set-Cookie: vaultauth_session=...\n  HttpOnly; SameSite=Lax\n  Path=/; Max-Age=604800`}
          />
        </div>
      </div>

      {/* Code snippet teaser */}
      <div className={styles.codeSection}>
        <h2 className={styles.flowTitle}>Zero magic. Just fetch.</h2>
        <p className={styles.codeSub}>
          The entire integration is ~150 lines across 3 files. No OAuth SDK required.
        </p>
        <div className={styles.fileList}>
          <FileCard
            name="src/app/api/login/route.ts"
            description="Generates PKCE, stores verifier in cookie, redirects to VaultAuth"
          />
          <FileCard
            name="src/app/callback/page.tsx"
            description="Validates state, exchanges code for token, fetches userinfo, sets session"
          />
          <FileCard
            name="src/app/api/logout/route.ts"
            description="Clears session cookie, redirects to home"
          />
        </div>
      </div>
    </div>
  )
}

// --- Sub-components ---

function FlowStep({ number, title, description, code }: { number: string; title: string; description: string; code: string }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepNumber}>{number}</div>
      <div className={styles.stepContent}>
        <div className={styles.stepTitle}>{title}</div>
        <p className={styles.stepDesc}>{description}</p>
        <pre className={styles.stepCode}>{code}</pre>
      </div>
    </div>
  )
}

function FlowArrow() {
  return (
    <div className={styles.arrow} aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12l7 7 7-7" stroke="#3730a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function FileCard({ name, description }: { name: string; description: string }) {
  return (
    <div className={styles.fileCard}>
      <code className={styles.fileName}>{name}</code>
      <p className={styles.fileDesc}>{description}</p>
    </div>
  )
}

// --- VaultAuth Shield Icon ---

function VaultAuthIcon({ size = 24, color = '#818cf8' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="VaultAuth"
    >
      <path
        d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
