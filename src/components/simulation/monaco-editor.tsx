"use client"

import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}

export function MonacoEditor({ value, onChange, language, theme = "vs-dark", options = {} }: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Monaco Editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme,
      ...options,
    })

    // Handle value changes
    const disposable = editorRef.current.onDidChangeModelContent(() => {
      const currentValue = editorRef.current?.getValue() || ""
      onChange(currentValue)
    })

    return () => {
      disposable.dispose()
      editorRef.current?.dispose()
    }
  }, [])

  // Update value when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value)
    }
  }, [value])

  // Update language when prop changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])

  return <div ref={containerRef} className="w-full h-full" />
}
