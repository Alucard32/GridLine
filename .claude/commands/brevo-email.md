---
description: Generate on-brand Brevo email templates for GridLine
argument-hint: [email-type] [optional-context]
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Brevo Email Generator

Generate Brevo-compatible HTML email templates that match the GridLine brand.

## Email Type: $ARGUMENTS

## Your Task

Create a Brevo-compatible HTML email template based on the email type specified above. If no type is specified, ask the user what kind of email they need.

### Available Email Types

- **welcome**: New user welcome email
- **purchase**: Order confirmation with download link
- **tips**: Product tips and guidance
- **strava**: Strava connection prompt
- **nudge**: Re-engagement for inactive users
- **winback**: Win-back for dormant users
- **custom**: Custom email (describe in context)

## Brand Guidelines

### Colors (use exact hex values)

| Color | Hex | Usage |
|-------|-----|-------|
| Forest Pine Green | `#2D5A3D` | Headers, section labels, accent borders, icon backgrounds |
| Summit Orange | `#D4763A` | CTA buttons, links |
| Stone 900 | `#1c1917` | Headlines, strong text |
| Stone 700 | `#44403c` | Body text |
| Stone 500 | `#78716c` | Secondary/muted text |
| Stone 400 | `#A8A29E` | Footer text |
| Stone 100 | `#F5F5F4` | Feature card backgrounds, footer |
| Warm Off-White | `#FAF9F7` | Email body background |
| White | `#FFFFFF` | Main content container |

### Typography

- Font: `Arial, Helvetica, sans-serif` (email-safe)
- Body: 16px, line-height 1.7, color `#44403c`
- Headlines: Bold, `#1c1917` or `#FFFFFF` on dark backgrounds
- Section labels: 13px, uppercase, letter-spacing 0.5px, `#2D5A3D`
- Muted text: 13-14px, `#78716c`

### Voice & Tone

Write as Holy, founder of GridLine:
- Personal, casual, friendly (not corporate)
- Direct and conversational
- Enthusiastic without being over the top
- Use "I" not "we"
- Sign off with "Happy trails, Holy" (or "Take care, Holy" for final/goodbye emails)

**Copy rules:**
- NO em dashes (use periods, commas, or colons instead)
- NO corporate speak or marketing jargon
- Keep sentences short and punchy
- Use concrete examples over abstract benefits

### Storytelling Principles

Use these techniques to improve open rates and engagement:

**1. Lead with relatability:**
- Share a personal struggle Holy had ("I almost gave up on my first map...")
- Acknowledge the reader's situation ("Life gets busy. No guilt trip.")

**2. Create emotional visualization:**
- Help them picture their specific route ("that marathon PR, that mountain ride")
- Contrast current state vs. desired state ("Right now it's data. It could be on your wall.")

**3. Loss framing (gentle):**
- "That adventure is still sitting in a folder somewhere"
- "It could be something you actually look at every day"

**4. Remove friction:**
- Emphasize speed: "5 minutes. That's all it takes."
- Show multiple paths: GPX upload, Strava connect, city search

**5. Respect the reader:**
- Always offer an easy unsubscribe without guilt
- "No pressure" and "no worries" language
- Ask for feedback genuinely

**6. For win-back emails:**
- Reconnect with why they signed up originally
- Lead with value (what's new) not guilt
- Create finality/urgency on last emails ("Last one from me")

### Template Variables

Use these Brevo placeholders:

**Contact attributes (always available):**
- `{{ contact.FIRSTNAME }}` - User's first name from contact record
- `{{ contact.EMAIL }}` - User's email

**Event properties (only in event-triggered automations like purchase):**
- `{{ event.firstName }}` - First name passed with the event
- `{{ event.productName }}` - Product name (e.g., "Medium Poster (18×24\")")
- `{{ event.productType }}` - "poster" or "sculpture"

**System variables:**
- `{{ unsubscribe }}` - Unsubscribe URL (required in footer)

**When to use which:**
- Welcome/onboarding emails: Use `{{ contact.FIRSTNAME }}`
- Purchase/event-triggered emails: Use `{{ event.firstName }}` and other event properties

## HTML Requirements

Brevo requires specific HTML structure:

### Must Do
- All CSS must be inline (no `<style>` blocks except MSO conditionals)
- Use table-based layouts only
- Use HTML entities for emojis (`&#128205;` for 📍)
- Include MSO conditional for Outlook
- Include preview text in hidden div
- Max width: 560px

### Must Avoid
- CSS gradients (use solid colors)
- Flexbox/Grid
- External fonts
- JavaScript
- Media queries
- Complex hover states

## Email Structure

```
┌─────────────────────────────────────────┐
│           Body Background               │
│           (#FAF9F7)                     │
│  ┌───────────────────────────────────┐  │
│  │      Main Container (white)       │  │
│  │      border-radius: 16px          │  │
│  │      max-width: 560px             │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Header (#2D5A3D)          │  │  │
│  │  │   - Logo                    │  │  │
│  │  │   - Badge (optional)        │  │  │
│  │  │   - Headline (white)        │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Content (white bg)        │  │  │
│  │  │   - Intro paragraphs        │  │  │
│  │  │   - Feature cards (optional)│  │  │
│  │  │   - CTA button              │  │  │
│  │  │   - Personal note (optional)│  │  │
│  │  │   - Sign-off                │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Footer (#F5F5F4)          │  │  │
│  │  │   - Unsubscribe link        │  │  │
│  │  │   - Privacy link            │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Component Snippets

### Header Badge
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom: 16px;">
  <tr>
    <td style="background-color: rgba(255,255,255,0.15); border-radius: 50px; padding: 8px 16px;">
      <span style="color: #FFFFFF; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">BADGE TEXT</span>
    </td>
  </tr>
</table>
```

### Feature Card
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px;">
  <tr>
    <td style="padding: 16px 20px; background-color: #F5F5F4; border-radius: 12px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td width="44" valign="top">
            <div style="width: 32px; height: 32px; background-color: #2D5A3D; border-radius: 8px; text-align: center; line-height: 32px; color: #FFFFFF; font-size: 14px;">&#128205;</div>
          </td>
          <td valign="top">
            <p style="color: #1c1917; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: bold; margin: 0 0 2px 0;">Feature Title</p>
            <p style="color: #78716c; font-family: Arial, Helvetica, sans-serif; font-size: 13px; margin: 0;">Feature description</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### CTA Button
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="border-radius: 12px; background-color: #D4763A;">
      <a href="URL_HERE" style="display: inline-block; padding: 16px 36px; color: #FFFFFF; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 12px;">
        Button Text &rarr;
      </a>
    </td>
  </tr>
</table>
```

### Accent Border Note
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  <tr>
    <td style="border-left: 3px solid #2D5A3D; padding-left: 16px;">
      <p style="color: #57534e; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; margin: 0;">
        <strong style="color: #44403c;">Note:</strong> Content here.
      </p>
    </td>
  </tr>
</table>
```

### Section Label
```html
<p style="color: #2D5A3D; font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 16px 0;">
  Section Title
</p>
```

## Emoji HTML Entities

| Emoji | Entity | Use case |
|-------|--------|----------|
| 📍 | `&#128205;` | Location, routes |
| 🎨 | `&#127912;` | Styles, palettes |
| 🖼️ | `&#128444;` | Posters, frames |
| ⛰️ | `&#9968;` | Mountains, terrain |
| 🏃 | `&#127939;` | Running |
| 🚴 | `&#128692;` | Cycling |
| ✅ | `&#9989;` | Checkmark, done |
| 📧 | `&#128231;` | Email |
| 🔗 | `&#128279;` | Links |
| ⬇️ | `&#11015;` | Download |
| 🎉 | `&#127881;` | Celebration |
| 📁 | `&#128193;` | Files, GPX |
| 🔒 | `&#128274;` | Privacy, security |
| ⚡ | `&#9889;` | Fast, Strava |
| 🌍 | `&#127758;` | Globe, explore |
| 👥 | `&#128101;` | Community |
| 📷 | `&#128247;` | Photo, share |
| ✏️ | `&#9997;` | Write, review |
| 💬 | `&#128172;` | Chat, refer |
| ⚫ | `&#9899;` | 3D sculpture |

## Reference

For the full Welcome Email template and more details, see:
@docs/PRD-BREVO-EMAIL-AUTOMATION.md (Email Template Design Guidelines section)

## Output

Generate the complete HTML email template that:
1. Uses the exact brand colors and typography
2. Follows the email structure above
3. Includes all required elements (preview text, MSO conditional, footer with unsubscribe)
4. Uses the appropriate template variables
5. Has compelling, on-brand copy in Holy's voice
6. Is ready to paste directly into Brevo's "Code your own" editor

After generating, remind the user:
- Go to Brevo → Templates → Create → "Code your own" → Paste
- Test on Gmail, Outlook, and mobile before sending
