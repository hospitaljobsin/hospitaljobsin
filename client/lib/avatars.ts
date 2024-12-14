import gravatar from "gravatar";

export function getGravatarURL(email: string): string {
    return gravatar.url(email, {s: '100', d: 'retro'})
}