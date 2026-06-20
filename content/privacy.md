# Privacy Policy

**App:** Nudge
**Last updated:** June 16, 2026

We built Nudge to help you plan your day by speaking or typing, without filling in forms. We take a privacy-first approach: we collect as little as possible, we do not sell your data, and we do not use advertising or tracking. This policy explains, in plain language, what we collect, why, and the choices you have.

## 1. Who we are and how to contact us

Nudge is provided by Nam Le, an individual operating from the United States. There is no company entity — the person responsible for your data (the "data controller") is Nam Le.

If you have any question about your privacy or this policy, email us:

- **Email:** nudgeplannerapp@gmail.com

## 2. Information we collect, and why

We only collect what we need to make the app work for you.

**Account information**

- Your **email address** and a **display name**, handled through our authentication provider (Supabase Auth).
- We use this to create and secure your account, sign you in, and send you essential account messages (for example, the one-time code to confirm your email at sign-up).

**Your content**

- The **tasks and calendar items** you create.
- **Learned scheduling preferences** — the constraints and typical routine durations the app picks up from how you plan, so it can suggest better times and lengths.
- An **action journal** — a short record of recent changes that powers the in-app undo feature.

We use this content solely to provide the planning features you asked for: showing your schedule, applying your preferences, and letting you undo a recent change.

**Voice you choose to speak**

- When you tap the microphone, the app captures audio so it can understand what you said. See "How voice works" below for the important detail: that audio is processed **on your device** and is **not** sent to us or to anyone else.

We do **not** create advertising profiles, and we do **not** track you across other apps or websites.

## 3. What we do NOT collect

We want to be just as clear about what we leave alone:

- **No raw voice recordings leave your phone.** We do not store or transmit your audio.
- **No location data.**
- **No contacts, photos, or media library access.**
- **No health or fitness data.**
- **No third-party analytics, advertising, tracking, or crash-reporting tools.** There are no ad or analytics SDKs in the app.
- **No selling or sharing of your data for advertising**, ever.
- **No cross-app tracking.** Because we do not track you across other companies' apps or sites, the app does not show Apple's App Tracking Transparency prompt.

## 4. How voice works (on-device transcription)

This is the part we are proudest of.

1. You tap the microphone and speak.
2. Your speech is transcribed **entirely on your device** using an on-device speech model (Moonshine ASR). The **raw audio never leaves your phone** — it is not uploaded to us or to any third party.
3. Only the resulting **text transcript** is sent onward, to Google's Gemini API, so the AI can interpret your plan (for example, turning "move my run to 7am tomorrow" into the right calendar change).

In short: your voice stays on your device; only the typed-out meaning of what you said is sent to be understood.

## 5. Subprocessors (who helps us run the service)

We rely on two service providers ("subprocessors") to operate the app. We share only what is necessary, as described above.

**Supabase — hosting, authentication, and database**

- Stores your account and content data and handles sign-in.
- Data is hosted in the United States (us-east-1).
- Each user's data is isolated using database Row-Level Security (see Security below).

**Google Gemini API — interpreting your plan**

- Receives the **text transcript** of what you said (or typed) so it can work out the calendar changes you want.
- We use Gemini on a **paid API tier**. Under Google's paid API terms, the prompts we send and the responses we receive are **not used to train Google's models** and are **not reviewed by humans for training purposes**. This is the strong privacy posture we have deliberately chosen.

## 6. Where your data is stored, and how we protect it

- **Location:** your account and content data are stored with Supabase in the United States (us-east-1).
- **In transit:** all communication between the app and our providers is encrypted using TLS.
- **Isolation:** your data is protected by **Row-Level Security (RLS)**, which enforces that one user can only ever read or write their own rows. You cannot see anyone else's data, and they cannot see yours.

No method of storage or transmission is ever 100% secure, but we use industry-standard protections and minimize what we hold in the first place.

## 7. Data retention and deletion

We keep your account and content data for as long as your account exists, so the app can show you your plan and remember your preferences.

You are always in control, and you can delete everything yourself:

- **In the app, go to Profile → Delete account.**
- You will be asked to confirm. This is **permanent and cannot be undone.**
- Deletion removes your account **and all associated data** — tasks, learned preferences, and your action journal.
- Your account and all associated data are **deleted immediately and permanently** when you confirm — this **cannot be undone**.

If you ever have trouble deleting your data from within the app, email us at nudgeplannerapp@gmail.com and we will take care of it.

## 8. Your privacy rights

You have rights over your personal data, and we honor them regardless of where you live. Across the board: **we do not sell or share your personal information**, and we do not use it for cross-context behavioral advertising.

**If you are in California (CCPA/CPRA)**

You have the right to:

- **Know** what personal information we collect and how we use it (this policy describes it).
- **Access** a copy of your personal information.
- **Delete** your personal information (use Profile → Delete account, or email us).
- **Correct** inaccurate personal information.
- **Opt out of sale or sharing** — though there is nothing to opt out of, because we never sell or share your data.
- **Not be discriminated against** for exercising any of these rights.

**If you are in the EEA or the UK (GDPR)**

You have the right to:

- **Access** your personal data.
- **Rectify** (correct) inaccurate data.
- **Erase** your data ("right to be forgotten").
- **Restrict** or **object** to certain processing.
- **Data portability** — receive your data in a usable format.
- **Lodge a complaint** with your local data protection authority.

Our legal bases for processing are: performing our contract with you (providing the app), and your consent (for example, when you choose to use the microphone).

To exercise any right, email us at nudgeplannerapp@gmail.com. You can also delete everything yourself at any time via Profile → Delete account.

## 9. Children's privacy

Nudge is **not directed to children under 13**, and the app is rated **4+** for general audiences. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, email us at nudgeplannerapp@gmail.com and we will delete it.

## 10. Changes to this policy

We may update this policy from time to time — for example, if we add a feature or change a provider. When we make a material change, we will update the **"Last updated"** date above and, where appropriate, notify you in the app. Please review this page periodically.

## 11. Governing law

This Privacy Policy is governed by the laws of the State of Washington, United States, without regard to its conflict-of-laws rules.

---

**Last updated:** June 16, 2026
