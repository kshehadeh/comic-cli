import type { ZodError } from "zod"

export function collectZodErrors(zodError: ZodError) {
    const errors = []
    for (const error of zodError.errors) {
        const path = error.path.join('.')
        errors.push(`${path} -> ${error.message}`)
    }
    return errors
}

export function html2markdown(html: string): string {
    return html
        .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
        .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n')
        .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n')
        .replace(/<h6>(.*?)<\/h6>/g, '###### $1\n')
        .replace(/<p>(.*?)<\/p>/g, '$1\n')
        .replace(/<ul>(.*?)<\/ul>/g, '$1\n')
        .replace(/<li>(.*?)<\/li>/g, '- $1\n')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
}