# Adea QA Checklist

Covers everything currently live in the app (auth, onboarding, Dashboard, Life Areas, Brain Dump). An interactive, self-saving version of this same checklist is also available as a Claude Artifact for actual click-through testing — ask Claude Code for the current link if you don't have it.

Update this file whenever a new feature ships so the checklist stays current.

## Account & login
- [ ] Sign up with a new email + password — account is created without error
- [ ] Right after signing up, you land on the Welcome / onboarding screen (not the Dashboard)
- [ ] Log out — sent to the Log in screen
- [ ] Log back in with the same email + password — lands on the Dashboard (onboarding won't repeat)
- [ ] Try logging in with the wrong password — a clear error shows, no crash
- [ ] Use "Forgot password" with your email — a status message confirms the reset email was sent

## Onboarding
- [ ] Read the Welcome screen, tap Get started — moves into the first question
- [ ] Each question screen shows one question and a progress dot row ("1 of 7", etc.)
- [ ] Skip one question — moves on without forcing an answer
- [ ] Answer the "dream" and "goal" questions with real text — remember what you typed
- [ ] Reach the final "what's on your mind" screen and finish — lands on the Dashboard
- [ ] Confirm the Dashboard is NOT empty — your goal appears under Active Goals, your dream under Dreams & Vision
- [ ] Try revisiting the onboarding URL after finishing — redirected straight to the Dashboard

## Dashboard
- [ ] Greeting shows your name if given, otherwise "Hi there"
- [ ] Today's Focus shows a friendly empty message if nothing is due
- [ ] Money Snapshot shows $0.00 before any transactions — no errors
- [ ] Active Goals shows the onboarding goal with a progress bar
- [ ] "What's on your mind?" button goes to Brain Dump
- [ ] Log out button in the header works

## Life Areas
- [ ] Tap "Life Areas" in the bottom nav — shows all 12 areas as a grid
- [ ] Open each of the 12 areas one at a time — every one loads without error
- [ ] In Money, add one Income, one Expense, one Bill, and one Debt entry — each shows in "Recent"
- [ ] Refresh the Dashboard — Money Snapshot reflects the expense(s) added
- [ ] In a non-Money area, add an item with a title, notes, and a due date — shows with a due-date tag
- [ ] Add another item with no due date — saves fine, no tag shown
- [ ] Refresh after adding items — everything is still there

## Brain Dump
- [ ] Type a note and tap Capture — appears under "Recent captures" right away
- [ ] Status shown is "pending" (expected — AI sorting isn't built yet)

## Adea (chat tab)
- [ ] Tap the Adea tab — shows a "coming soon" message, no crash

## Profile
- [ ] Shows your correct email address
- [ ] Log out works from here too

## Navigation & general feel
- [ ] Bottom nav appears on Dashboard, Life Areas, Brain Dump, Adea, and Profile — current tab highlighted
- [ ] Bottom nav does NOT appear on Log in, Sign up, or Onboarding screens
- [ ] Works on a real phone (or a narrow browser window) with no overlap or sideways scrolling
- [ ] Refreshing while logged in keeps you logged in

## Known gaps — don't report these as bugs
- Adea chat is a "coming soon" placeholder, no real AI replies yet
- Brain Dump doesn't auto-sort into a Life Area yet (next AI milestone)
- "Upgrade to Premium" doesn't do anything yet — no payments wired up
- "Export my data" / "Delete account" are placeholders
- No notifications yet

## Reporting a bug
For each bug: what you did (exact steps), what you expected, what actually happened, and a screenshot if possible.
