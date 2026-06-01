import { useEffect, useMemo, useRef } from 'react'
import { FileText, Upload, X } from 'lucide-react'

interface FileZoneProps {
  label: string
  file: File | null
  accept: string
  onSelect: (f: File) => void
  onClear: () => void
}

export function FileZone({ label, file, accept, onSelect, onClear }: FileZoneProps) {
  const ref = useRef<HTMLInputElement>(null)
  const preview = useMemo(
    () => (file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onSelect(f)
          e.target.value = ''
        }}
      />
      {file ? (
        <div className="relative border rounded-xl overflow-hidden bg-muted/30">
          {preview ? (
            <img src={preview} alt={label} className="w-full h-44 object-cover" />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/60 hover:bg-primary/5 transition-colors"
        >
          <Upload className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF — max 10 MB</p>
        </button>
      )}
    </div>
  )
}
