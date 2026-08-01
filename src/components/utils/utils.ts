export function cloneTemplate<T extends HTMLElement>(templateId: string): T {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) {
        throw new Error(`Template with id "${templateId}" not found`);
    }
    return template.content.firstElementChild?.cloneNode(true) as T;
}
