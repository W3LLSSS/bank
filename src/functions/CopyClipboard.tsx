export function CopytoClipboard(text: string) {
    navigator.clipboard.writeText(text)

    if(navigator.clipboard) {
        alert("Copiado al portapapeles" )
    }
}