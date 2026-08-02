import { describe, test, expect } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

describe("auth.ts smoke test", () => {
  test("auth.ts exports NextAuth handlers, auth, signIn, signOut", () => {
    const content = readFileSync(resolve(__dirname, "../../../auth.ts"), "utf-8")
    expect(content).toContain('handlers')
    expect(content).toContain('auth')
    expect(content).toContain('signIn')
    expect(content).toContain('signOut')
  })

  test("auth.ts configures VaultAuth OAuth provider with required fields", () => {
    const content = readFileSync(resolve(__dirname, "../../../auth.ts"), "utf-8")
    expect(content).toMatch(/id:\s*["']vaultauth["']/)
    expect(content).toMatch(/type:\s*"oauth"/)
    expect(content).toMatch(/authorization:/)
    expect(content).toMatch(/token:/)
    expect(content).toMatch(/userinfo:/)
    expect(content).toMatch(/clientId:/)
    expect(content).toMatch(/clientSecret:/)
    expect(content).toMatch(/pkce/)
  })

  test("auth.ts profile function maps picture to image", () => {
    const content = readFileSync(resolve(__dirname, "../../../auth.ts"), "utf-8")
    expect(content).toContain("profile.picture ?? null")
  })

  test("auth.ts profile function maps sub to id, email, name fields", () => {
    const content = readFileSync(resolve(__dirname, "../../../auth.ts"), "utf-8")
    expect(content).toMatch(/id:\s*profile\.sub/)
    expect(content).toMatch(/email:\s*profile\.email/)
    expect(content).toMatch(/name:\s*profile\.name/)
  })
})